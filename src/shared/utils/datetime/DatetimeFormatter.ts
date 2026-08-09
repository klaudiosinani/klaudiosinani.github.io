import { LOCALE } from "@config/site";
import type { DatetimeValue } from "./DatetimeValue";

export class DatetimeFormatter {
  private static readonly DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  private static readonly TIME_OPTIONS: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  public static formatDate(value: DatetimeValue): string {
    return new Date(value).toLocaleDateString(
      LOCALE.langTag,
      DatetimeFormatter.DATE_OPTIONS
    );
  }

  public static formatTime(value: DatetimeValue): string {
    return new Date(value).toLocaleTimeString(
      LOCALE.langTag,
      DatetimeFormatter.TIME_OPTIONS
    );
  }
}
