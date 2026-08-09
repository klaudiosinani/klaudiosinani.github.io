import type { PublicationDates } from "@features/publication/PublicationDates";
import CalendarIcon from "@components/icons/CalendarIcon";
import FormattedDatetime from "./FormattedDatetime";
import { DisplayDatetimeResolver } from "@utils/datetime/DisplayDatetimeResolver";

interface Props extends PublicationDates {
  readonly size?: "sm" | "lg";
  readonly className?: string;
}

export default function Datetime({
  pubDatetime,
  modDatetime,
  size = "sm",
  className = "",
}: Props) {
  const textSize = size === "sm" ? "text-sm" : "text-base";
  const iconScale = size === "sm" ? "scale-90" : "scale-100";

  return (
    <div
      className={`flex items-center space-x-2 opacity-80 ${className}`.trim()}
    >
      <CalendarIcon
        className={`${iconScale} inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base`}
        ariaHidden
      />
      {DisplayDatetimeResolver.isUpdated(pubDatetime, modDatetime) ? (
        <span className={`italic ${textSize}`}>Updated:</span>
      ) : (
        <span className="sr-only">Published:</span>
      )}
      <span className={`italic ${textSize}`}>
        <FormattedDatetime
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
        />
      </span>
    </div>
  );
}
