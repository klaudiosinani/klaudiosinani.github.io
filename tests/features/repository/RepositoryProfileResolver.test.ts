import { describe, expect, it } from "vitest";
import { RepositoryProfileResolver } from "@app/feature/repository/service/RepositoryProfileResolver";
import type { FeaturedSoftware } from "@app/feature/software/FeaturedSoftware";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";

const underTest: typeof RepositoryProfileResolver = RepositoryProfileResolver;

const profile = (overrides: Partial<RepositoryProfile> = {}): RepositoryProfile => ({
    slug: "signale",
    name: "signale",
    logline: "Highly configurable logging library",
    description: "Highly configurable logging library",
    url: "https://github.com/klaudiosinani/signale",
    language: "JavaScript",
    license: "MIT",
    topics: [],
    createdAt: "2017-10-01T00:00:00Z",
    stars: 9179,
    forks: 231,
    downloads: { total: 41_872_004, sources: [], caveats: [] },
    trend: [],
    starHistory: [],
    releases: [],
    totals: {
        commits: 128,
        openIssues: 0,
        closedIssues: 0,
        openPullRequests: 0,
        mergedPullRequests: 0,
    },
    packages: [],
    latestCommit: null,
    languages: [],
    contributors: null,
    clones: null,
    dependents: null,
    manual: null,
    documents: [],
    citation: null,
    ...overrides,
});

const curated = (overrides: Partial<FeaturedSoftware> = {}): FeaturedSoftware => ({
    name: "Signale.js",
    logline: "Highly configurable logging library",
    description: "Configurable to the core.",
    url: "https://github.com/klaudiosinani/signale",
    order: 1,
    ...overrides,
});

describe("RepositoryProfileResolver.resolve", () => {
    it("givenACuratedEntry_whenResolving_thenItsWordingReplacesTheGatheredText", () => {
        const resolved: RepositoryProfile = underTest.resolve(profile(), [curated()]);

        expect(resolved.name).toBe("Signale.js");
        expect(resolved.description).toBe("Configurable to the core.");
    });

    it("givenACuratedEntry_whenResolving_thenTheGatheredFiguresAreUntouched", () => {
        const resolved: RepositoryProfile = underTest.resolve(profile(), [curated()]);

        expect(resolved.stars).toBe(9179);
        expect(resolved.downloads.total).toBe(41_872_004);
    });

    it("givenNoMatchingEntry_whenResolving_thenTheProfileIsReturnedAsGathered", () => {
        const gathered: RepositoryProfile = profile();

        const resolved: RepositoryProfile = underTest.resolve(gathered, [
            curated({ url: "https://github.com/klaudiosinani/taskbook" }),
        ]);

        expect(resolved).toBe(gathered);
    });

    it("givenATrailingSlashOnTheCuratedUrl_whenResolving_thenItStillMatches", () => {
        const resolved: RepositoryProfile = underTest.resolve(profile(), [
            curated({ url: "https://github.com/klaudiosinani/signale/" }),
        ]);

        expect(resolved.name).toBe("Signale.js");
    });

    it("givenADifferentlyCasedUrl_whenResolving_thenItStillMatches", () => {
        const resolved: RepositoryProfile = underTest.resolve(profile(), [
            curated({ url: "https://github.com/Klaudiosinani/Signale" }),
        ]);

        expect(resolved.name).toBe("Signale.js");
    });

    it("givenNoCuratedEntriesAtAll_whenResolving_thenNothingChanges", () => {
        const gathered: RepositoryProfile = profile();

        const resolved: RepositoryProfile = underTest.resolve(gathered, []);

        expect(resolved).toBe(gathered);
    });
});
