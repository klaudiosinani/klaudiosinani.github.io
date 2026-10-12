import type { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter";

export class ReportingWindowFormatter {
    private readonly datetimeFormatter: DatetimeFormatter;

    public constructor(datetimeFormatter: DatetimeFormatter) {
        this.datetimeFormatter = datetimeFormatter;
    }
    public between(start: Date | null, end: Date): string {
        const to: string = this.datetimeFormatter.formatDate(end.toISOString());

        if (!start || start.getTime() >= end.getTime()) {
            return `to ${to}`;
        }

        return `${this.datetimeFormatter.formatDate(start.toISOString())} to ${to}`;
    }
}
