import type { ContributionSource } from "@app/feature/impact/ContributionSource";
import type { IssueSearchSource } from "@app/feature/impact/IssueSearchSource";
import type { NpmDownloadsSource } from "@app/infrastructure/registry/npm/service/NpmDownloadsSource";
import type { ReleaseTotalsSource } from "@app/feature/impact/ReleaseTotalsSource";
import type { SnapInstalledBaseSource } from "@app/infrastructure/registry/snapcraft/service/SnapInstalledBaseSource";
import type { TrafficSource } from "@app/feature/impact/TrafficSource";
import { describe, expect, it, vi } from "vitest";
import { LiveImpactDataProvider } from "@app/feature/impact/service/LiveImpactDataProvider";
import type { OutletDownloads } from "@app/feature/impact/OutletDownloads";
import type { OutletDownloadsSource } from "@app/feature/impact/service/outlet/OutletDownloadsSource";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import type { RetrievalService } from "@app/infrastructure/RetrievalService";

const repository = (name: string, stars: number): RepositoryData => ({
    name,
    description: "",
    url: `https://github.com/user/${name}`,
    stars,
    forks: 0,
    language: null,
    latestUpdate: "2026-01-01T00:00:00Z",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestPush: "2026-01-01T00:00:00Z",
});

const repositories = (entries: RepositoryData[]): RetrievalService<RepositoryData> => ({
    retrieve: () => Promise.resolve(entries),
});

const npm = (overrides: Record<string, unknown> = {}) =>
    ({
        totals: vi.fn().mockResolvedValue({
            month: 100,
            quarter: 300,
            year: 1000,
            all: 10_000,
            trend: { month: [1, 2], quarter: [1, 2], year: [1, 2, 3], all: [5, 6] },
            ...overrides,
        }),
    }) satisfies NpmDownloadsSource;

const contributing = (commits: number | null) =>
    ({
        contributions: vi.fn().mockResolvedValue(commits === null ? null : { commits, activeDays: 91 }),
    }) satisfies ContributionSource;

const outlet = (downloads: OutletDownloads): OutletDownloadsSource => ({
    downloads: vi.fn().mockResolvedValue(downloads),
});

const outlets = (): OutletDownloadsSource[] => [
    outlet({ outlet: "pypi", month: 5, quarter: null, year: null, all: null }),
    outlet({ outlet: "homebrew", month: 2, quarter: null, year: 9, all: null }),
];

const snapcraft = (installedBase: number | null = null) =>
    ({
        installedBase: vi.fn().mockResolvedValue(installedBase),
    }) satisfies SnapInstalledBaseSource;

const search = () =>
    ({
        contributions: vi.fn().mockResolvedValue({
            commits: 12,
            pullRequestsOpened: 6,
            pullRequestsClosed: 4,
            issuesOpened: 3,
            issuesClosed: 2,
        }),
        open: vi.fn().mockResolvedValue({ openPullRequests: 8, openIssues: 40 }),
    }) satisfies IssueSearchSource;

const releasing = () =>
    ({
        releases: vi.fn().mockResolvedValue({ downloads: 500, publishedAt: ["2026-08-01"] }),
    }) satisfies ReleaseTotalsSource;

const trafficking = () =>
    ({
        traffic: vi.fn().mockResolvedValue(null),
    }) satisfies TrafficSource;

describe("LiveImpactDataProvider.provide", () => {
    it("givenReleaseDownloads_whenProviding_thenTheyLandOnlyOnTheAllTimeWindow", async () => {
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider({
            repositories: repositories([repository("one", 5)]),
            npm: npm(),
            search: search(),
            releases: releasing(),
            trafficSource: trafficking(),
            contributions: contributing(null),
            outlets: outlets(),
            snapcraft: snapcraft(),
        });

        const { periods } = await underTest.provide("user");

        expect(periods.month.downloads).toBe(107);
        expect(periods.year.downloads).toBe(1009);
        expect(periods.all.downloads).toBe(10_500);
    });

    it("givenRepositories_whenProviding_thenTheSnapshotAggregatesThem", async () => {
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider({
            repositories: repositories([repository("one", 5), repository("two", 7)]),
            npm: npm(),
            search: search(),
            releases: releasing(),
            trafficSource: trafficking(),
            contributions: contributing(null),
            outlets: outlets(),
            snapcraft: snapcraft(),
        });

        const { snapshot } = await underTest.provide("user");

        expect(snapshot).toEqual({
            openPullRequests: 8,
            openIssues: 40,
            projects: 2,
            stars: 12,
            forks: 0,
        });
    });

    it("givenEveryWindow_whenProviding_thenIssueCountsAreResolvedForEachOne", async () => {
        const source: IssueSearchSource = search();
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider({
            repositories: repositories([repository("one", 1)]),
            npm: npm(),
            search: source,
            releases: releasing(),
            trafficSource: trafficking(),
            contributions: contributing(null),
            outlets: outlets(),
            snapcraft: snapcraft(),
        });

        const { periods } = await underTest.provide("user");

        expect(Object.keys(periods)).toEqual(["month", "quarter", "year", "all"]);
        expect(source.contributions).toHaveBeenCalledTimes(7);
        expect(periods.month.pullRequestsClosed).toBe(4);
        expect(periods.month.commits).toBe(12);
        expect(periods.month.releases).toBe(1);
    });

    it("givenNoTrafficToken_whenProviding_thenTrafficIsAbsentRatherThanZero", async () => {
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider({
            repositories: repositories([repository("one", 1)]),
            npm: npm(),
            search: search(),
            releases: releasing(),
            trafficSource: trafficking(),
            contributions: contributing(null),
            outlets: outlets(),
            snapcraft: snapcraft(),
        });

        const { traffic, downloadTrend } = await underTest.provide("user");

        expect(traffic).toBeNull();
        expect(downloadTrend.year).toEqual([1, 2, 3]);
    });

    it("givenNoInjectedCollaborators_whenConstructed_thenDefaultsAreUsed", () => {
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider();

        expect(underTest).toBeInstanceOf(LiveImpactDataProvider);
    });
});

describe("LiveImpactDataProvider outlet reporting", () => {
    it("givenOutletsWithDifferentCoverage_whenProviding_thenGapsStayNullInTheBreakdown", async () => {
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider({
            repositories: repositories([repository("one", 1)]),
            npm: npm(),
            search: search(),
            releases: releasing(),
            trafficSource: trafficking(),
            contributions: contributing(null),
            outlets: outlets(),
            snapcraft: snapcraft(),
        });

        const { outlets: breakdown } = await underTest.provide("user");

        expect(breakdown.map(({ outlet }: OutletDownloads) => outlet)).toEqual(["npm", "github", "pypi", "homebrew"]);
        expect(breakdown.find((o: OutletDownloads) => o.outlet === "github")?.month).toBeNull();
        expect(breakdown.find((o: OutletDownloads) => o.outlet === "pypi")?.all).toBeNull();
    });

    it("givenSnapcraftCredentials_whenProviding_thenInstalledBaseIsCarriedSeparately", async () => {
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider({
            repositories: repositories([repository("one", 1)]),
            npm: npm(),
            search: search(),
            releases: releasing(),
            trafficSource: trafficking(),
            contributions: contributing(null),
            outlets: outlets(),
            snapcraft: snapcraft(12_408),
        });

        const { installedBase, periods } = await underTest.provide("user");

        expect(installedBase).toBe(12_408);
        expect(periods.all.downloads).toBe(10_500);
    });
});

describe("LiveImpactDataProvider commit counting", () => {
    it("givenNoContributionsToken_whenProviding_thenThePublicSearchCountStands", async () => {
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider({
            repositories: repositories([repository("one", 1)]),
            npm: npm(),
            search: search(),
            releases: releasing(),
            trafficSource: trafficking(),
            contributions: contributing(null),
            outlets: outlets(),
            snapcraft: snapcraft(),
        });

        const { periods } = await underTest.provide("user");

        expect(periods.year.commits).toBe(12);
        expect(periods.year.activeDays).toBeNull();
    });

    it("givenAContributionsToken_whenProviding_thenPrivateCommitsSupersedeTheSearchCount", async () => {
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider({
            repositories: repositories([repository("one", 1)]),
            npm: npm(),
            search: search(),
            releases: releasing(),
            trafficSource: trafficking(),
            contributions: contributing(4612),
            outlets: outlets(),
            snapcraft: snapcraft(),
        });

        const { periods } = await underTest.provide("user");

        expect(periods.year.commits).toBe(4612);
        expect(periods.year.activeDays).toBe(91);
    });
});

describe("LiveImpactDataProvider outlet extensibility", () => {
    it("givenAChannelTheAggregateHasNeverHeardOf_whenProviding_thenItIsCountedAnyway", async () => {
        const snapcraftStore: OutletDownloadsSource = outlet({
            outlet: "npm",
            month: 1_000,
            quarter: null,
            year: null,
            all: null,
        });
        const underTest: LiveImpactDataProvider = new LiveImpactDataProvider({
            repositories: repositories([repository("one", 1)]),
            npm: npm(),
            search: search(),
            releases: releasing(),
            trafficSource: trafficking(),
            contributions: contributing(null),
            outlets: [...outlets(), snapcraftStore],
            snapcraft: snapcraft(),
        });

        const { periods, outlets: breakdown } = await underTest.provide("user");

        expect(periods.month.downloads).toBe(1_107);
        expect(breakdown).toHaveLength(5);
        expect(snapcraftStore.downloads).toHaveBeenCalled();
    });
});
