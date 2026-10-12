import type { ActivityKind } from "@app/feature/activity/timeline/ActivityKind";
import type { JSX } from "react";
import ExternalLink from "@ui/component/ExternalLink";
import type { IconComponent } from "@ui/icon/IconComponent";
import CommitIcon from "@ui/component/icon/CommitIcon";
import TagIcon from "@ui/component/icon/TagIcon";
import type { ActivityEntry } from "@app/feature/activity/timeline/ActivityEntry";

import { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter.ts";

const DATETIME_FORMATTER: DatetimeFormatter = new DatetimeFormatter();

interface Props {
    readonly entry: ActivityEntry;
}

export default function TimelineEntry({ entry }: Props): JSX.Element {
    const kind: ActivityKind = entry.getKind();
    const title: string = entry.getTitle();
    const reference: string = entry.getReference();
    const context: string = entry.getContext();
    const url: string = entry.getUrl();
    const occurredAt: string = entry.getOccurredAt();
    const isRelease: boolean = kind === "release";
    const TypeIcon: IconComponent = isRelease ? TagIcon : CommitIcon;

    return (
        <li className="timeline-entry" data-kind={kind}>
            <ExternalLink href={url} className="timeline-link">
                <span className="timeline-node">
                    <TypeIcon className="timeline-icon" />
                </span>
                <span className="timeline-headline">
                    <span className="sr-only">{isRelease ? "Release: " : "Commit: "}</span>
                    <span className="activity-title">{title}</span>
                    <code className="activity-ref">{reference}</code>
                </span>
                <span className="timeline-meta">
                    <span>{context}</span>
                    <span>{DATETIME_FORMATTER.formatDate(occurredAt)}</span>
                </span>
            </ExternalLink>
        </li>
    );
}
