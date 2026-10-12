import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import type { JSX } from "react";
import CalendarIcon from "@ui/component/icon/CalendarIcon";
import ForkIcon from "@ui/component/icon/ForkIcon";
import LanguageChip from "@ui/component/LanguageChip";
import StarIcon from "@ui/component/icon/StarIcon";

import { ViewTransitionName } from "@app/util/routing/ViewTransitionName.ts";
import { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter.ts";
import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { TitleFormatter } from "@app/util/text/TitleFormatter.ts";

const VIEW_TRANSITION_NAME: ViewTransitionName = new ViewTransitionName(new SlugFormatter());
const DATETIME_FORMATTER: DatetimeFormatter = new DatetimeFormatter();
const NUMBER_FORMATTER: NumberFormatter = new NumberFormatter();
const ROUTE_PATH_RESOLVER: RoutePathResolver = new RoutePathResolver();
const TITLE_FORMATTER: TitleFormatter = new TitleFormatter();
export interface SoftwareCardProps {
    readonly name: string;
    readonly description: string;
    readonly stars: number;
    readonly forks: number;
    readonly language: string | null;
    readonly latestUpdate: string;
    readonly secHeading?: boolean;
}

export default function SoftwareCard({
    name,
    description,
    stars,
    forks,
    language,
    latestUpdate,
    secHeading = true,
}: SoftwareCardProps): JSX.Element {
    const heading: JSX.Element = (
        <a
            href={ROUTE_PATH_RESOLVER.resolveRepository(name)}
            className="card-link"
            style={{ viewTransitionName: VIEW_TRANSITION_NAME.of("software", name) }}
        >
            {TITLE_FORMATTER.format(name)}
        </a>
    );

    return (
        <li
            className="panel"
            data-name={name}
            data-stars={stars}
            data-updated={latestUpdate}
            data-languages={language ?? ""}
        >
            <div className="panel-body">
                <div className="panel-content">
                    {secHeading ? (
                        <h2 className="project-name">{heading}</h2>
                    ) : (
                        <h3 className="project-name">{heading}</h3>
                    )}
                    {description && <p className="card-summary">{description}</p>}
                    {language && (
                        <div className="project-languages">
                            <LanguageChip language={language} />
                        </div>
                    )}
                </div>
                <div className="card-meta card-footer">
                    <span title="Stars">
                        <StarIcon className="card-meta-icon" ariaHidden />
                        {NUMBER_FORMATTER.display(stars)}
                    </span>
                    <span title="Forks">
                        <ForkIcon className="card-meta-icon" ariaHidden />
                        {NUMBER_FORMATTER.display(forks)}
                    </span>
                    <span title="Last change">
                        <CalendarIcon className="card-meta-icon" ariaHidden />
                        {DATETIME_FORMATTER.formatDate(latestUpdate)}
                    </span>
                </div>
            </div>
        </li>
    );
}
