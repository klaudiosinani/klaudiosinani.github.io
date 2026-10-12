import type { JSX } from "react";
import type { PublicationDates } from "@app/feature/publication/reading/PublicationDates";

import { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter.ts";
import { DisplayDatetimeResolver } from "@app/util/datetime/DisplayDatetimeResolver.ts";

const DATETIME_FORMATTER: DatetimeFormatter = new DatetimeFormatter();
const DISPLAY_DATETIME_RESOLVER: DisplayDatetimeResolver = new DisplayDatetimeResolver();
export default function FormattedDatetime({ pubDatetime, modDatetime }: PublicationDates): JSX.Element {
    const datetime: Date = new Date(DISPLAY_DATETIME_RESOLVER.resolve(pubDatetime, modDatetime));

    return (
        <>
            <time dateTime={datetime.toISOString()}>{DATETIME_FORMATTER.formatDate(datetime)}</time>
            <span aria-hidden="true"> · </span>
            <span className="sr-only">&nbsp;at&nbsp;</span>
            <span className="text-nowrap">{DATETIME_FORMATTER.formatTime(datetime)}</span>
        </>
    );
}
