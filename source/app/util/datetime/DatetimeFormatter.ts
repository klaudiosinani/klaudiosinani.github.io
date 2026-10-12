import type { DatetimeValue } from "./DatetimeValue";
import { LOCALE } from "@app/configuration/site/SiteLocale";

export class DatetimeFormatter {
    private readonly DATE_OPTIONS: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    private readonly TIME_OPTIONS: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
    };

    public formatDate(value: DatetimeValue): string {
        return new Date(value).toLocaleDateString(LOCALE.getLanguageTag(), this.DATE_OPTIONS);
    }

    public formatTime(value: DatetimeValue): string {
        return new Date(value).toLocaleTimeString(LOCALE.getLanguageTag(), this.TIME_OPTIONS);
    }
}
