import type { PeriodMetricKey } from "@app/feature/impact/metric/PeriodMetricKey";
import type { DownloadDeltaCalculator } from "@app/feature/impact/change/DownloadDeltaCalculator";
import type { MetricDeltaCalculator } from "@app/feature/impact/change/MetricDeltaCalculator";
import type { ReportingPeriods } from "@app/util/period/ReportingPeriods";
import type { ImpactData } from "../metric/ImpactData";
import type { MetricDelta } from "./MetricDelta";
import type { PeriodDeltas } from "./PeriodDeltas";
import type { PeriodMetrics } from "../metric/PeriodMetrics";

export class PeriodDeltasCalculator {
    private readonly downloadDeltaCalculator: DownloadDeltaCalculator;
    private readonly metricDeltaCalculator: MetricDeltaCalculator;
    private readonly reportingPeriods: ReportingPeriods;

    public constructor(
        downloadDeltaCalculator: DownloadDeltaCalculator,
        metricDeltaCalculator: MetricDeltaCalculator,
        reportingPeriods: ReportingPeriods
    ) {
        this.downloadDeltaCalculator = downloadDeltaCalculator;
        this.metricDeltaCalculator = metricDeltaCalculator;
        this.reportingPeriods = reportingPeriods;
    }
    public compute(impact: ImpactData, keys: readonly PeriodMetricKey[]): PeriodDeltas {
        const deltas: PeriodDeltas = {} as PeriodDeltas;

        for (const period of this.reportingPeriods.ALL) {
            const previous: PeriodMetrics | null = impact.getPreviousPeriods()[period];
            const forPeriod: Partial<Record<PeriodMetricKey, MetricDelta | null>> = {
                downloads: this.downloadDeltaCalculator.compute(impact.getDownloadTrend().year, period),
            };

            for (const key of keys) {
                const current: number | null = impact.getPeriods()[period].getValue(key);

                forPeriod[key] =
                    current === null
                        ? null
                        : this.metricDeltaCalculator.compute(current, previous?.getValue(key) ?? null, period);
            }

            deltas[period] = forPeriod;
        }

        return deltas;
    }
}
