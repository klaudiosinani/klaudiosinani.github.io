import { describe, expect, it } from "vitest";
import { RepositoryOgDetailsResolver } from "@app/feature/repository/service/RepositoryOgDetailsResolver";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";

import type { RepositoryOgDetails } from "@app/infrastructure/og/domain/RepositoryOgDetails";
import type { RepositoryOgFigure } from "@app/infrastructure/og/domain/RepositoryOgDetails";
const underTest: typeof RepositoryOgDetailsResolver = RepositoryOgDetailsResolver;

const release: RepositoryRelease = {
    tag: "v4.2.0",
    name: "Signale v4.2.0",
    publishedAt: "2026-08-09T09:12:00Z",
    notes: "",
    url: "https://github.com/klaudiosinani/signale/releases/tag/v4.2.0",
    downloads: 0,
};

const profile = (overrides: Partial<RepositoryProfile> = {}): RepositoryProfile => ({
    slug: "signale",
    name: "Signale.js",
    logline: "Highly configurable logging library",
    description: "Configurable to the core.",
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
    totals: null,
    packages: [],
    latestCommit: null,
    languages: [],
    contributors: 9,
    clones: null,
    dependents: null,
    manual: null,
    documents: [],
    citation: null,
    ...overrides,
});

describe("RepositoryOgDetailsResolver.resolve", () => {
    it("givenAProfile_whenResolving_thenTheCardCarriesTheCuratedNameAndLogline", () => {
        const details: RepositoryOgDetails = underTest.resolve(profile());

        expect(details.name).toBe("Signale.js");
        expect(details.logline).toBe("Highly configurable logging library");
    });

    it("givenAProfile_whenResolving_thenTheCardStatesWhereItLeads", () => {
        const details: RepositoryOgDetails = underTest.resolve(profile());

        expect(details.address).toBe("klaudiosinani.com/signale/");
    });

    it("givenPublishedReleases_whenResolving_thenTheNewestVersionIsStated", () => {
        const details: RepositoryOgDetails = underTest.resolve(
            profile({ releases: [release, { ...release, tag: "v4.1.0" }] })
        );

        expect(details.version).toBe("v4.2.0");
    });

    it("givenNoRelease_whenResolving_thenNoVersionIsClaimed", () => {
        const details: RepositoryOgDetails = underTest.resolve(profile());

        expect(details.version).toBeNull();
    });

    it("givenAWidelyUsedProject_whenResolving_thenTheThreeStrongestFiguresLead", () => {
        const details: RepositoryOgDetails = underTest.resolve(
            profile({
                dependents: { repositories: 154_518, packages: 1_907, notable: [] },
            })
        );

        expect(details.figures).toEqual([
            { value: "41.9M", label: "Downloads" },
            { value: "9,179", label: "Stars" },
            { value: "154.5K", label: "Dependents" },
        ]);
    });

    it("givenNothingPublishedToARegistry_whenResolving_thenNoDownloadsAreClaimed", () => {
        const details: RepositoryOgDetails = underTest.resolve(
            profile({ downloads: { total: null, sources: [], caveats: [] } })
        );

        expect(details.figures.map(({ label }: RepositoryOgFigure) => label)).toEqual([
            "Stars",
            "Contributors",
            "Forks",
        ]);
    });

    it("givenASoleAuthor_whenResolving_thenTheContributorCountIsNotWorthStating", () => {
        const details: RepositoryOgDetails = underTest.resolve(
            profile({
                downloads: { total: null, sources: [], caveats: [] },
                contributors: 1,
            })
        );

        expect(details.figures.map(({ label }: RepositoryOgFigure) => label)).toEqual(["Stars", "Forks"]);
    });

    it("givenNoDependentsCount_whenResolving_thenTheCardClaimsNone", () => {
        const details: RepositoryOgDetails = underTest.resolve(profile({ dependents: null }));

        expect(details.figures.map(({ label }: RepositoryOgFigure) => label)).not.toContain("Dependents");
    });

    it("givenAQuietRepository_whenResolving_thenNoFigureIsShownRatherThanZeroes", () => {
        const details: RepositoryOgDetails = underTest.resolve(
            profile({
                downloads: { total: null, sources: [], caveats: [] },
                stars: 0,
                forks: 0,
                contributors: null,
            })
        );

        expect(details.figures).toEqual([]);
    });
});
