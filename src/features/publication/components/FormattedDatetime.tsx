import type { PublicationDates } from "@features/publication/PublicationDates";
import { DatetimeFormatter } from "@utils/datetime/DatetimeFormatter";
import { DisplayDatetimeResolver } from "@utils/datetime/DisplayDatetimeResolver";

export default function FormattedDatetime({
  pubDatetime,
  modDatetime,
}: PublicationDates) {
  const datetime = new Date(
    DisplayDatetimeResolver.resolve(pubDatetime, modDatetime)
  );

  return (
    <>
      <time dateTime={datetime.toISOString()}>
        {DatetimeFormatter.formatDate(datetime)}
      </time>
      <span aria-hidden="true"> | </span>
      <span className="sr-only">&nbsp;at&nbsp;</span>
      <span className="text-nowrap">
        {DatetimeFormatter.formatTime(datetime)}
      </span>
    </>
  );
}
