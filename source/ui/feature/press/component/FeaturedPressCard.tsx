import type { JSX } from "react";
import ArrowRightIcon from "@ui/component/icon/ArrowRightIcon";
import CalendarIcon from "@ui/component/icon/CalendarIcon";
import PackageIcon from "@ui/component/icon/PackageIcon";

import { PressIssueFormatter } from "@app/feature/press/coverage/PressIssueFormatter.ts";

const PRESS_ISSUE_FORMATTER: PressIssueFormatter = new PressIssueFormatter();
export interface FeaturedPressCardProps {
    readonly publicationTitle: string;
    readonly summary: string;
    readonly publisherName: string;
    readonly publicationUrl: string;
    readonly issueNumber: string;
    readonly softwareTitle: string;
    readonly softwareHref: string;
    readonly publisherIcon?: string | null;
    readonly lead?: boolean;
    readonly secHeading?: boolean;
}

export default function FeaturedPressCard({
    publicationTitle,
    summary,
    publisherName,
    publicationUrl,
    issueNumber,
    softwareTitle,
    softwareHref,
    publisherIcon = null,
    lead = false,
    secHeading = true,
}: FeaturedPressCardProps): JSX.Element {
    const year: string = PRESS_ISSUE_FORMATTER.format(issueNumber);

    const external: boolean = !softwareHref.startsWith("/");

    const heading: JSX.Element = (
        <a href={publicationUrl} target="_blank" rel="noopener noreferrer" className="card-link">
            {publicationTitle}
        </a>
    );

    return (
        <li className={lead ? "panel press-lead" : "panel"}>
            <div className="panel-body">
                <div className="panel-content">
                    {secHeading ? <h2 className="card-title">{heading}</h2> : <h3 className="card-title">{heading}</h3>}
                    <p className="card-summary">{summary}</p>
                </div>
                <div className="card-meta card-footer press-footer">
                    <span className="press-publisher">
                        {publisherIcon && (
                            <img
                                src={publisherIcon}
                                alt=""
                                className="press-icon"
                                width={16}
                                height={16}
                                loading="lazy"
                                decoding="async"
                            />
                        )}
                        {publisherName}
                    </span>
                    <a
                        href={softwareHref}
                        className="press-project"
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                        <PackageIcon className="card-meta-icon" ariaHidden />
                        {softwareTitle}
                    </a>
                    {year && (
                        <span title="The year of the feature">
                            <CalendarIcon className="card-meta-icon" ariaHidden />
                            {year}
                        </span>
                    )}
                    <span className="press-read">
                        Read the article
                        <ArrowRightIcon ariaHidden />
                    </span>
                </div>
            </div>
        </li>
    );
}
