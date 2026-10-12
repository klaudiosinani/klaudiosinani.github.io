import { describe, expect, it } from "vitest";
import { RepositoryFigureClusterFactory } from "@app/feature/repository/factory/RepositoryFigureClusterFactory";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";

import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";
import type { RepositoryFigureCluster } from "@app/feature/repository/RepositoryFigureCluster";
import type { RepositoryFigure } from "@app/feature/repository/RepositoryFigureCluster";
const underTest: typeof RepositoryFigureClusterFactory = RepositoryFigureClusterFactory;

const release: RepositoryRelease = {
    tag: "v1.0.0",
    name: "v1.0.0",
    publishedAt: "2025-01-01T00:00:00Z",
    notes: "",
    url: "https://github.com/klaudiosinani/signale/releases/tag/v1.0.0",
    downloads: 0,
};

const profile = (overrides: Partial<RepositoryProfile> = {}): RepositoryProfile => ({
    slug: "signale",
    name: "Signale.js",
    logline: "",
    description: "",
    url: "https://github.com/klaudiosinani/signale",
    language: "JavaScript",
    license: "MIT",
    topics: [],
    createdAt: "2017-10-01T00:00:00Z",
    stars: 9179,
    forks: 231,
    downloads: { total: 41_900_000, sources: [], caveats: [] },
    trend: [],
    starHistory: [],
    releases: [release],
    totals: {
        commits: 128,
        openIssues: 29,
        closedIssues: 42,
        openPullRequests: 10,
        mergedPullRequests: 43,
    },
    packages: [],
    latestCommit: null,
    languages: [],
    contributors: 12,
    clones: null,
    dependents: null,
    manual: null,
    documents: [],
    citation: null,
    ...overrides,
});

const named = (name: string, clusters: { name: string }[]): boolean =>
    clusters.some((cluster: { name: string }) => cluster.name === name);

const group = <Cluster extends { name: string }>(name: string, clusters: Cluster[]): Cluster =>
    clusters.find((cluster: Cluster) => cluster.name === name) as Cluster;

describe("RepositoryFigureClusterFactory.create", () => {
    it("givenAProfile_whenGrouping_thenEachGroupIsNamedAndCarriesFigures", () => {
        const clusters: RepositoryFigureCluster[] = underTest.create(profile());

        expect(clusters.map(({ name }: RepositoryFigureCluster) => name)).toEqual([
            "Community",
            "Delivery",
            "Review",
            "Issues",
        ]);

        for (const cluster of clusters) {
            expect(cluster.figures.length).toBeGreaterThan(0);
        }
    });

    it("givenAChartOnThePage_whenGrouping_thenTheDownloadsAreNotRepeated", () => {
        const clusters: RepositoryFigureCluster[] = underTest.create(profile());

        expect(named("Adoption", clusters)).toBe(false);
    });

    it("givenNoChart_whenGrouping_thenTheDownloadsAreShownWithTheOthers", () => {
        const adoption: RepositoryFigureCluster = group("Adoption", underTest.create(profile(), true));

        expect(adoption.figures[0].label).toBe("downloads");
    });

    it("givenReleaseFiles_whenGrouping_thenTheyAreNotCountedTwice", () => {
        const clusters: RepositoryFigureCluster[] = underTest.create(
            profile({ releases: [{ ...release, downloads: 1_284 }] })
        );

        expect(named("Adoption", clusters)).toBe(false);
    });

    it("givenACloneCount_whenGrouping_thenItStatesTheWindowItCounts", () => {
        const adoption: RepositoryFigureCluster = group("Adoption", underTest.create(profile({ clones: 612 })));

        expect(adoption.figures[0].label).toBe("git clones");
        expect(adoption.figures[0].title).toContain("14 days");
    });

    it("givenNoTrafficToken_whenGrouping_thenNoCloneCountIsShown", () => {
        expect(named("Adoption", underTest.create(profile()))).toBe(false);
    });

    it("givenTotalsThatCouldNotBeRead_whenGrouping_thenTheirGroupIsLeftOut", () => {
        const clusters: RepositoryFigureCluster[] = underTest.create(profile({ totals: null }));

        expect(named("Maintenance", clusters)).toBe(false);
        expect(named("Community", clusters)).toBe(true);
    });

    it("givenNoContributorCount_whenGrouping_thenTheOtherFiguresRemain", () => {
        const [community] = underTest.create(profile({ contributors: null }));

        expect(community.figures.map(({ label }: RepositoryFigure) => label)).toEqual(["stars", "forks"]);
    });

    it("givenAFigureThatCountsThePresent_whenGrouping_thenItSaysSoUnderThePointer", () => {
        const figures: RepositoryFigure[] = underTest
            .create(profile())
            .flatMap(({ figures: group }: RepositoryFigureCluster) => group);

        expect(figures.find(({ label }: RepositoryFigure) => label === "open issues")?.title).toContain("right now");
        expect(figures.find(({ label }: RepositoryFigure) => label === "stars")?.title).toBeUndefined();
    });
});

describe("RepositoryFigureClusterFactory.create, beside the activity section", () => {
    const SITE: string[] = ["Community", "Adoption", "Delivery", "Review", "Issues"];

    it("givenAWholeProfile_whenGrouping_thenTheGroupsAreTheOnesTheSiteUses", () => {
        const clusters: RepositoryFigureCluster[] = underTest.create(profile({ clones: 612 }), true);

        expect(clusters.map(({ name }: RepositoryFigureCluster) => name)).toEqual(SITE);
    });

    it("givenTheDelivery_whenGrouping_thenItHoldsTheCommitsAndTheReleases", () => {
        const delivery: RepositoryFigureCluster = group("Delivery", underTest.create(profile()));

        expect(delivery.figures.map(({ label }: RepositoryFigure) => label)).toEqual(["commits", "releases"]);
    });

    it("givenTheReviewAndTheIssues_whenGrouping_thenEachHoldsItsOwnPair", () => {
        const clusters: RepositoryFigureCluster[] = underTest.create(profile());

        expect(group("Review", clusters).figures.map(({ label }: RepositoryFigure) => label)).toEqual([
            "PRs merged",
            "open PRs",
        ]);
        expect(group("Issues", clusters).figures.map(({ label }: RepositoryFigure) => label)).toEqual([
            "issues closed",
            "open issues",
        ]);
    });

    it("givenNoRecordOfTheIssues_whenGrouping_thenTheFiguresAreStatedAsUnknown", () => {
        const clusters: RepositoryFigureCluster[] = underTest.create(profile({ totals: null }));

        expect(clusters.map(({ name }: RepositoryFigureCluster) => name)).toEqual([
            "Community",
            "Delivery",
            "Review",
            "Issues",
        ]);
        expect(
            group("Delivery", clusters).figures.map(({ label, value }: RepositoryFigure) => `${label}:${value}`)
        ).toEqual(["commits:null", "releases:1"]);
        expect(group("Issues", clusters).figures.every(({ value }: RepositoryFigure) => value === null)).toBe(true);
    });
});
