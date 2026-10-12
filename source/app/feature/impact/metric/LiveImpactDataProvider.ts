import type { OutletDownloadsFactory } from "@app/feature/impact/outlet/OutletDownloadsFactory";
import type { PeriodDownloadsCalculator } from "@app/feature/impact/aggregation/PeriodDownloadsCalculator";
import type { ReportingPeriods } from "@app/util/period/ReportingPeriods";
import type { SnapshotMetricsCalculator } from "@app/feature/impact/aggregation/SnapshotMetricsCalculator";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import { NpmDownloadTotalsFactory } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotalsFactory";
import type { NpmDownloadTotalsService } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotalsService";
import type { SnapcraftInstallsRetrievalService } from "@app/feature/repository/download/SnapcraftInstallsRetrievalService";
import type { IssueSearchSource } from "../github/IssueSearchSource";
import type { ReleaseTotalsSource } from "../github/ReleaseTotalsSource";
import type { TrafficSource } from "../github/TrafficSource";
import type { ContributionSource } from "../github/ContributionSource";
import type { ReleaseCountSource } from "../github/ReleaseCountSource";
import { ImpactData } from "./ImpactData";
import type { ImpactDataProvider } from "./ImpactDataProvider";
import type { OutletDownloads } from "../outlet/OutletDownloads";
import type { OutletDownloadsSource } from "../outlet/OutletDownloadsSource";
import { PeriodMetrics } from "./PeriodMetrics";
import type { ReleaseTotals } from "../github/ReleaseTotals";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";

import type { IssueTotals } from "@app/feature/impact/github/IssueTotals";
import type { ContributionTotals } from "@app/feature/impact/github/ContributionTotals";
import type { NpmDownloadTotals } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotals";
export class LiveImpactDataProvider implements ImpactDataProvider {
    private readonly repositories: RetrievalService<GithubRepositoryData>;
    private readonly npm: NpmDownloadTotalsService;
    private readonly search: IssueSearchSource;
    private readonly releases: ReleaseTotalsSource;
    private readonly trafficSource: TrafficSource;
    private readonly contributions: ContributionSource;
    private readonly outlets: readonly OutletDownloadsSource[];
    private readonly snapcraft: SnapcraftInstallsRetrievalService;
    private readonly releaseCounts: ReleaseCountSource;
    private readonly optionalReader: OptionalReader;
    private readonly outletDownloadsFactory: OutletDownloadsFactory;
    private readonly periodDownloadsCalculator: PeriodDownloadsCalculator;
    private readonly reportingPeriods: ReportingPeriods;
    private readonly snapshotMetricsCalculator: SnapshotMetricsCalculator;

    public constructor(
        repositories: RetrievalService<GithubRepositoryData>,
        npm: NpmDownloadTotalsService,
        search: IssueSearchSource,
        releases: ReleaseTotalsSource,
        trafficSource: TrafficSource,
        contributions: ContributionSource,
        outlets: readonly OutletDownloadsSource[],
        snapcraft: SnapcraftInstallsRetrievalService,
        releaseCounts: ReleaseCountSource,
        optionalReaderFactory: OptionalReaderFactory,
        outletDownloadsFactory: OutletDownloadsFactory,
        periodDownloadsCalculator: PeriodDownloadsCalculator,
        reportingPeriods: ReportingPeriods,
        snapshotMetricsCalculator: SnapshotMetricsCalculator
    ) {
        this.repositories = repositories;
        this.npm = npm;
        this.search = search;
        this.releases = releases;
        this.trafficSource = trafficSource;
        this.contributions = contributions;
        this.outlets = outlets;
        this.snapcraft = snapcraft;
        this.releaseCounts = releaseCounts;
        this.optionalReader = optionalReaderFactory.create("GitHub");
        this.outletDownloadsFactory = outletDownloadsFactory;
        this.periodDownloadsCalculator = periodDownloadsCalculator;
        this.reportingPeriods = reportingPeriods;
        this.snapshotMetricsCalculator = snapshotMetricsCalculator;
    }

    public async provide(username: string): Promise<ImpactData> {
        const repositories: GithubRepositoryData[] = await this.repositories.retrieve();
        const names: string[] = repositories.map((githubRepositoryData: GithubRepositoryData) =>
            githubRepositoryData.getName()
        );

        const npm: NpmDownloadTotals = await this.npmTotals(names);

        const [releases, sourced, open, traffic, installedBase] = await Promise.all([
            this.releases.releases(username, names),
            Promise.all(this.outlets.map((outlet: OutletDownloadsSource) => outlet.downloads(repositories))),
            this.search.open(username),
            this.trafficSource.traffic(username, repositories),
            this.installedBase(),
        ]);

        const outlets: OutletDownloads[] = this.outletDownloadsFactory.create(npm, releases, sourced);

        return new ImpactData(
            (await this.windows(username, outlets, releases, 0)) as Record<ReportingPeriod, PeriodMetrics>,
            await this.windows(username, outlets, releases, 1),
            outlets,
            this.snapshotMetricsCalculator.compute(repositories, open),
            traffic,
            installedBase,
            npm.getTrend(),
            (await this.contributions.contributions(username, "year"))?.getDays() ?? [],
            npm.getLastPublishedDay()
        );
    }

    private async windows(
        username: string,
        outlets: OutletDownloads[],
        releases: ReleaseTotals,
        windowsBack: number
    ): Promise<Record<ReportingPeriod, PeriodMetrics | null>> {
        const periods: Record<"month" | "quarter" | "year" | "all", PeriodMetrics | null> = {} as Record<
            ReportingPeriod,
            PeriodMetrics | null
        >;

        for (const period of this.reportingPeriods.ALL) {
            if (windowsBack > 0 && period === "all") {
                periods[period] = null;
                continue;
            }

            periods[period] = await this.metricsOf(username, period, windowsBack, outlets, releases);
        }

        return periods;
    }

    private async metricsOf(
        username: string,
        period: ReportingPeriod,
        windowsBack: number,
        outlets: OutletDownloads[],
        releases: ReleaseTotals
    ): Promise<PeriodMetrics> {
        const counts: IssueTotals = await this.search.contributions(username, period, windowsBack);

        const collected: ContributionTotals | null =
            windowsBack === 0 ? await this.contributions.contributions(username, period) : null;

        return new PeriodMetrics(
            this.periodDownloadsCalculator.compute(outlets, period),
            collected?.getCommits() ?? counts.getCommits(),
            collected?.getActiveDays() ?? null,
            this.releaseCounts.compute(releases.getPublishedAt(), period, windowsBack),
            counts.getPullRequestsOpened(),
            counts.getPullRequestsClosed(),
            counts.getIssuesOpened(),
            counts.getIssuesClosed()
        );
    }

    private async npmTotals(names: string[]): Promise<NpmDownloadTotals> {
        const totals: NpmDownloadTotals | null = await this.optionalReader.read<NpmDownloadTotals>(
            "the npm downloads of every package",
            () => this.npm.getTotals(names, new Date())
        );

        return totals ?? new NpmDownloadTotalsFactory().createEmpty();
    }

    private async installedBase(): Promise<number | null> {
        const installs: Map<string, number> = await this.snapcraft.retrieve(new Date());

        if (installs.size === 0) {
            return null;
        }

        return [...installs.values()].reduce((total: number, count: number) => total + count, 0);
    }
}
