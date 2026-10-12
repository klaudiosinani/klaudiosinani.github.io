import type { ContributionDay } from "../github/ContributionDay";
import type { OutletDownloads } from "../outlet/OutletDownloads";
import type { PeriodMetrics } from "./PeriodMetrics";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";
import type { SnapshotMetrics } from "./SnapshotMetrics";
import type { TrafficMetrics } from "./TrafficMetrics";

export class ImpactData {
    private readonly periods: Record<ReportingPeriod, PeriodMetrics>;
    private readonly previousPeriods: Record<ReportingPeriod, PeriodMetrics | null>;
    private readonly outlets: OutletDownloads[];
    private readonly snapshot: SnapshotMetrics;
    private readonly traffic: TrafficMetrics | null;
    private readonly installedBase: number | null;
    private readonly downloadTrend: Record<ReportingPeriod, number[]>;
    private readonly contributionDays: ContributionDay[];
    private readonly lastPublishedDay: string | null;

    public constructor(
        periods: Record<ReportingPeriod, PeriodMetrics>,
        previousPeriods: Record<ReportingPeriod, PeriodMetrics | null>,
        outlets: OutletDownloads[],
        snapshot: SnapshotMetrics,
        traffic: TrafficMetrics | null,
        installedBase: number | null,
        downloadTrend: Record<ReportingPeriod, number[]>,
        contributionDays: ContributionDay[],
        lastPublishedDay: string | null
    ) {
        this.periods = periods;
        this.previousPeriods = previousPeriods;
        this.outlets = outlets;
        this.snapshot = snapshot;
        this.traffic = traffic;
        this.installedBase = installedBase;
        this.downloadTrend = downloadTrend;
        this.contributionDays = contributionDays;
        this.lastPublishedDay = lastPublishedDay;
    }

    public getPeriods(): Record<ReportingPeriod, PeriodMetrics> {
        return this.periods;
    }
    public getPreviousPeriods(): Record<ReportingPeriod, PeriodMetrics | null> {
        return this.previousPeriods;
    }
    public getOutlets(): OutletDownloads[] {
        return this.outlets;
    }
    public getSnapshot(): SnapshotMetrics {
        return this.snapshot;
    }
    public getTraffic(): TrafficMetrics | null {
        return this.traffic;
    }
    public getInstalledBase(): number | null {
        return this.installedBase;
    }
    public getDownloadTrend(): Record<ReportingPeriod, number[]> {
        return this.downloadTrend;
    }
    public getContributionDays(): ContributionDay[] {
        return this.contributionDays;
    }

    public getLastPublishedDay(): string | null {
        return this.lastPublishedDay;
    }
}
