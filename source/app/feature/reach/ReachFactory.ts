import type { DownloadDeltaCalculator } from "@app/feature/impact/change/DownloadDeltaCalculator";
import type { ImpactData } from "@app/feature/impact/metric/ImpactData";
import type { PeriodMetrics } from "@app/feature/impact/metric/PeriodMetrics";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";
import type { TrafficMetrics } from "@app/feature/impact/metric/TrafficMetrics";
import { Reach } from "./Reach";

export class ReachFactory {
    private readonly downloadDeltaCalculator: DownloadDeltaCalculator;

    public constructor(downloadDeltaCalculator: DownloadDeltaCalculator) {
        this.downloadDeltaCalculator = downloadDeltaCalculator;
    }

    public create(impactData: ImpactData, dependentRepositories: number | null): Reach {
        const periods: Record<ReportingPeriod, PeriodMetrics> = impactData.getPeriods();
        const traffic: TrafficMetrics | null = impactData.getTraffic();

        return new Reach(
            periods.all.getDownloads(),
            periods.month.getDownloads(),
            periods.year.getDownloads(),
            this.downloadDeltaCalculator.compute(impactData.getDownloadTrend().year, "month"),
            impactData.getSnapshot().getStars(),
            impactData.getSnapshot().getProjects(),
            dependentRepositories,
            traffic?.getViews() ?? null,
            traffic?.getUniqueVisitors() ?? null
        );
    }
}
