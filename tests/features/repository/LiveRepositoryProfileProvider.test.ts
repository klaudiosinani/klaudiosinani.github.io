import type { NpmDownloadsSource } from "@app/infrastructure/registry/npm/service/NpmDownloadsSource";
import type { PackageRegistryId } from "@app/feature/repository/PackageRegistryId";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import type { PackageListingSource } from "@app/feature/repository/PackageListingSource";
import type { PypiWindowSource } from "@app/infrastructure/registry/pypi/service/PypiWindowSource";
import type { RepositoryCommitSource } from "@app/feature/repository/RepositoryCommitSource";
import type { RepositoryTotalsSource } from "@app/feature/repository/RepositoryTotalsSource";
import type { RepositoryTrafficSource } from "@app/feature/repository/RepositoryTrafficSource";
import type { SnapInstallsSource } from "@app/infrastructure/registry/snapcraft/service/SnapInstallsSource";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { LiveRepositoryProfileProvider } from "@app/feature/repository/service/LiveRepositoryProfileProvider";
import { RepositoryDownloadsProvider } from "@app/feature/repository/service/RepositoryDownloadsProvider";
import type { DownloadTotals } from "@app/infrastructure/registry/npm/domain/DownloadTotals";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import type { RetrievalService } from "@app/infrastructure/RetrievalService";

import type { RepositoryTotals } from "@app/feature/repository/RepositoryTotals";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";
const repository = (overrides: Partial<RepositoryData> = {}): RepositoryData => ({
    name: "signale",
    description: "Highly configurable logging library",
    url: "https://github.com/klaudiosinani/signale",
    stars: 9179,
    forks: 231,
    language: "JavaScript",
    latestUpdate: "2026-08-01T00:00:00Z",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestPush: "2026-08-01T00:00:00Z",
    ...overrides,
});

const listing = <T>(items: T[]): RetrievalService<T> => ({
    retrieve: () => Promise.resolve(items),
});

const totals = (overrides: Partial<DownloadTotals> = {}): DownloadTotals => ({
    month: 0,
    quarter: 0,
    year: 0,
    all: 41_872_004,
    trend: { month: [], quarter: [], year: [], all: [1, 2, 3] },
    ...overrides,
});

const downloadsOf = (value: DownloadTotals): NpmDownloadsSource =>
    ({ totals: () => Promise.resolve(value) }) satisfies NpmDownloadsSource;

const NO_TOTALS: RepositoryTotals = {
    commits: 128,
    openIssues: 0,
    closedIssues: 0,
    openPullRequests: 0,
    mergedPullRequests: 0,
};

const quietCounts = () =>
    ({
        of: () => Promise.resolve(NO_TOTALS),
    }) satisfies RepositoryTotalsSource;
const quietCommits = () =>
    ({
        latest: () => Promise.resolve(null),
    }) satisfies RepositoryCommitSource;
const packagesOn = (registries: PackageRegistryId[] = []) =>
    ({
        listings: () =>
            Promise.resolve(
                registries.map((registry: PackageRegistryId) => ({
                    registry,
                    label: registry,
                    url: `https://example.test/${registry}`,
                    version: null,
                }))
            ),
    }) satisfies PackageListingSource;

const quietPackages = () => packagesOn();

const outlets = (pypi: { downloads: number; days: number } | null = null, snap: number | null = null) => ({
    pypi: {
        window: () => Promise.resolve(pypi),
    } satisfies PypiWindowSource,
    snapcraft: {
        forSnap: () => Promise.resolve(snap),
    } satisfies SnapInstallsSource,
});

const quietTraffic = () =>
    ({
        clones: () => Promise.resolve(null),
    }) satisfies RepositoryTrafficSource;

const providerWith = (
    repositories: RepositoryData[],
    downloads: DownloadTotals = totals(),
    reported: {
        pypi: PypiWindowSource;
        snapcraft: SnapInstallsSource;
    } = outlets(),
    packages: PackageListingSource = quietPackages()
) =>
    new LiveRepositoryProfileProvider({
        repositories: listing(repositories),
        counts: quietCounts(),
        commits: quietCommits(),
        packages,
        traffic: quietTraffic(),
        downloads: new RepositoryDownloadsProvider(downloadsOf(downloads), reported.pypi, reported.snapcraft),
    });

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const release = (overrides: Record<string, unknown> = {}) => ({
    tag_name: "v4.2.0",
    name: "Signale v4.2.0",
    body: "- Adds a scope option",
    html_url: "https://github.com/klaudiosinani/signale/releases/tag/v4.2.0",
    published_at: "2026-08-09T00:00:00Z",
    draft: false,
    prerelease: false,
    assets: [{ download_count: 12 }],
    ...overrides,
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("LiveRepositoryProfileProvider.provide", () => {
    it("givenAProjectThatIsOnNoRegistry_whenProviding_thenThePypiServiceIsNotAsked", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(jsonResponse([])));
        const asked: Mock<() => Promise<{ downloads: number; days: number }>> = vi.fn(() =>
            Promise.resolve({ downloads: 9, days: 1 })
        );
        const underTest: LiveRepositoryProfileProvider = providerWith([repository()], totals(), {
            pypi: { window: asked } satisfies PypiWindowSource,
            snapcraft: {
                forSnap: () => Promise.resolve(null),
            } satisfies SnapInstallsSource,
        });

        await underTest.provide(new RepositoryRef("klaudiosinani", "signale"));

        expect(asked).not.toHaveBeenCalled();
    });

    it("givenSeveralOutlets_whenProviding_thenTheFigureHoldsThemAllAndSaysWhatTheyCount", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(jsonResponse([release()])));
        const underTest: LiveRepositoryProfileProvider = providerWith(
            [repository()],
            totals(),
            outlets({ downloads: 712, days: 128 }, 3_400),
            packagesOn(["npm", "pypi"])
        );

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.downloads.total).toBe(41_872_004 + 12 + 712 + 3_400);
        expect(profile?.downloads.sources).toEqual(["npm", "GitHub releases", "PyPI", "Snap"]);
        expect(profile?.downloads.caveats).toEqual([
            "PyPI keeps 128 days of counts, and no record before them",
            "Snap gives the devices that hold it now, not the times it was fetched",
        ]);
    });

    it("givenAnUnknownSlug_whenProviding_thenNothingIsReturnedRatherThanAnEmptyProfile", async () => {
        const underTest: LiveRepositoryProfileProvider = providerWith([repository()]);

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "removed")
        );

        expect(profile).toBeNull();
    });

    it("givenGatheredFactsOnly_whenProviding_thenTheRepositoryOwnWordingStandsIn", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(jsonResponse([])));
        const underTest: LiveRepositoryProfileProvider = providerWith([repository()]);

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.name).toBe("signale");
        expect(profile?.logline).toBe("Highly configurable logging library");
    });

    it("givenDraftsAndUndatedReleases_whenProviding_thenOnlyPublishedOnesSurvive", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                jsonResponse([
                    release(),
                    release({ tag_name: "v5.0.0-rc", draft: true }),
                    release({ tag_name: "v0.0.1", published_at: null }),
                ])
            )
        );
        const underTest: LiveRepositoryProfileProvider = providerWith([repository()]);

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.releases.map((entry: RepositoryRelease) => entry.tag)).toEqual(["v4.2.0"]);
    });

    it("givenReleasesOutOfOrder_whenProviding_thenTheNewestLeads", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                jsonResponse([
                    release({ tag_name: "v1.0.0", published_at: "2020-01-01T00:00:00Z" }),
                    release({ tag_name: "v4.2.0", published_at: "2026-08-09T00:00:00Z" }),
                ])
            )
        );
        const underTest: LiveRepositoryProfileProvider = providerWith([repository()]);

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.releases.map((entry: RepositoryRelease) => entry.tag)).toEqual(["v4.2.0", "v1.0.0"]);
    });

    it("givenAReleaseNamedForItsTag_whenProviding_thenAssetsAreSummedAndTheNameFallsBack", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                jsonResponse([
                    release({
                        name: "   ",
                        body: null,
                        assets: [{ download_count: 5 }, { download_count: 7 }],
                    }),
                ])
            )
        );
        const underTest: LiveRepositoryProfileProvider = providerWith([repository()]);

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.releases[0].name).toBe("v4.2.0");
        expect(profile?.releases[0].notes).toBe("");
        expect(profile?.releases[0].downloads).toBe(12);
    });

    it("givenAReleaseWithoutAssets_whenProviding_thenItsDownloadsAreZero", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(jsonResponse([release({ assets: undefined })]))
        );
        const underTest: LiveRepositoryProfileProvider = providerWith([repository()]);

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.releases[0].downloads).toBe(0);
    });

    it("givenTheReleasesRequestFails_whenProviding_thenTheProfileStillRendersWithoutThem", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 500 }));
        const underTest: LiveRepositoryProfileProvider = providerWith([repository()]);

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.releases).toEqual([]);
        expect(profile?.stars).toBe(9179);
    });

    it("givenNothingPublishedToTheRegistry_whenProviding_thenDownloadsAreAbsentRatherThanZero", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(jsonResponse([])));
        const underTest: LiveRepositoryProfileProvider = providerWith([repository()], totals({ all: 0 }));

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.downloads.total).toBeNull();
    });

    it("givenASeriesTooSparseToRead_whenProviding_thenTheTrendIsEmptiedSoNoChartIsDrawn", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(jsonResponse([])));
        const sparse: DownloadTotals = totals({
            all: 162,
            trend: { month: [], quarter: [], year: [], all: [3, 0, 0, 0, 0] },
        });
        const underTest: LiveRepositoryProfileProvider = providerWith(
            [repository()],
            sparse,
            outlets(),
            packagesOn(["npm"])
        );

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.trend).toEqual([]);
        expect(profile?.downloads.total).toBe(162);
    });

    it("givenADifferentlyCasedSlug_whenProviding_thenTheRepositoryStillMatches", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(jsonResponse([])));
        const underTest: LiveRepositoryProfileProvider = providerWith(
            [repository()],
            totals(),
            outlets(),
            packagesOn(["npm"])
        );

        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "Signale")
        );

        expect(profile?.stars).toBe(9179);
        expect(profile?.trend).toEqual([1, 2, 3]);
    });
});
