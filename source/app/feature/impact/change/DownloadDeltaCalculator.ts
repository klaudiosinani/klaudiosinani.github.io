import type { MetricDeltaCalculator } from "@app/feature/impact/change/MetricDeltaCalculator";
import type { ReportingPeriods } from "@app/util/period/ReportingPeriods";
import type { MetricDelta } from "./MetricDelta";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class DownloadDeltaCalculator {
    private readonly metricDeltaCalculator: MetricDeltaCalculator;
    private readonly reportingPeriods: ReportingPeriods;

    public constructor(metricDeltaCalculator: MetricDeltaCalculator, reportingPeriods: ReportingPeriods) {
        this.metricDeltaCalculator = metricDeltaCalculator;
        this.reportingPeriods = reportingPeriods;
    }
    public compute(yearSeries: readonly number[], period: ReportingPeriod): MetricDelta | null {
        if (period === "all" || period === "year") {
            return null;
        }

        const days: number = this.reportingPeriods.days(period);

        if (yearSeries.length < days * 2) {
            return null;
        }

        return this.metricDeltaCalculator.compute(
            this.sum(yearSeries.slice(-days)),
            this.sum(yearSeries.slice(-days * 2, -days)),
            period
        );
    }

    private sum(values: readonly number[]): number {
        return values.reduce((total: number, value: number) => total + value, 0);
    }
}
