import type { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter";
import type { MonthEndCalculator } from "@app/util/period/MonthEndCalculator";
import type { ChartPoint } from "./ChartPoint";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class ChartPointsFactory {
    private readonly datetimeFormatter: DatetimeFormatter;
    private readonly monthEndCalculator: MonthEndCalculator;

    public constructor(datetimeFormatter: DatetimeFormatter, monthEndCalculator: MonthEndCalculator) {
        this.datetimeFormatter = datetimeFormatter;
        this.monthEndCalculator = monthEndCalculator;
    }

    public createMonthly(values: readonly number[], lastMonthEnd: Date | null): ChartPoint[] {
        if (values.length === 0) {
            return [];
        }

        if (!lastMonthEnd) {
            return values.map((value: number) => ({ at: "", value }));
        }

        const steps: number = values.length - 1;

        return values.map((value: number, index: number) => ({
            at: this.datetimeFormatter.formatDate(
                this.monthEndCalculator.shiftBack(lastMonthEnd, steps - index).toISOString()
            ),
            value,
        }));
    }
    public create(values: readonly number[], from: Date | null, to: Date): ChartPoint[] {
        if (values.length === 0) {
            return [];
        }

        if (!from || values.length === 1) {
            return values.map((value: number) => ({ at: "", value }));
        }

        const span: number = to.getTime() - from.getTime();
        const steps: number = values.length;

        return values.map((value: number, index: number) => ({
            at: this.datetimeFormatter.formatDate(
                new Date(from.getTime() + (span * (index + 1)) / steps).toISOString()
            ),
            value,
        }));
    }

    public all(
        trend: Record<ReportingPeriod, number[]>,
        starts: Record<ReportingPeriod, Date | null>,
        to: Date,
        lastMonthEnd: Date | null
    ): Record<ReportingPeriod, ChartPoint[]> {
        return Object.fromEntries(
            Object.entries(trend).map(([period, values]: [string, number[]]) => [
                period,
                period === "all"
                    ? this.createMonthly(values, lastMonthEnd)
                    : this.create(values, starts[period as ReportingPeriod], to),
            ])
        ) as Record<ReportingPeriod, ChartPoint[]>;
    }
}
