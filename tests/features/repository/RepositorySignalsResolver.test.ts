import { describe, expect, it } from "vitest";
import { RepositorySignalsResolver } from "@app/feature/repository/service/RepositorySignalsResolver";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";

import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";
import type { RepositoryCommit } from "@app/feature/repository/RepositoryCommit";
import type { SoftwareSignals } from "@app/feature/software/SoftwareSignals";
const underTest: typeof RepositorySignalsResolver = RepositorySignalsResolver;

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
    stars: 0,
    forks: 0,
    downloads: { total: null, sources: [], caveats: [] },
    trend: [],
    starHistory: [],
    releases: [],
    totals: {
        commits: 128,
        openIssues: 29,
        closedIssues: 42,
        openPullRequests: 10,
        mergedPullRequests: 43,
    },
    packages: [],
    latestCommit: null,
    languages: [
        { name: "JavaScript", share: 0.73 },
        { name: "TypeScript", share: 0.27 },
    ],
    contributors: null,
    clones: null,
    dependents: null,
    manual: null,
    documents: [],
    citation: null,
    ...overrides,
});

const release: RepositoryRelease = {
    tag: "v1.4.0",
    name: "v1.4.0",
    publishedAt: "2025-11-09T18:36:27Z",
    notes: "",
    url: "https://github.com/klaudiosinani/signale/releases/tag/v1.4.0",
    downloads: 0,
};

const commit: RepositoryCommit = {
    sha: "9f2c1ab8e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9",
    message: "Tighten the public type surface",
    url: "https://github.com/klaudiosinani/signale/commit/9f2c1ab",
    committedAt: "2025-11-09T18:36:27Z",
    checks: null,
};

describe("RepositorySignalsResolver.of", () => {
    it("givenAProfile_whenReducing_thenTheCardGetsLanguagesAndOpenCounts", () => {
        const signals: Map<string, SoftwareSignals> = underTest.of([profile()]);

        expect(signals.get("signale")).toEqual({
            languages: ["JavaScript", "TypeScript"],
            openIssues: 29,
            openPullRequests: 10,
            latestRelease: null,
            latestCommit: null,
            starHistory: [],
        });
    });

    it("givenReleases_whenReducing_thenTheNewestTagIsTheOneGiven", () => {
        const signals: Map<string, SoftwareSignals> = underTest.of([
            profile({ releases: [release, { ...release, tag: "v1.3.0" }] }),
        ]);

        expect(signals.get("signale")?.latestRelease).toBe("v1.4.0");
    });

    it("givenATipCommit_whenReducing_thenItsHashIsShortened", () => {
        const signals: Map<string, SoftwareSignals> = underTest.of([profile({ latestCommit: commit })]);

        expect(signals.get("signale")?.latestCommit).toBe("9f2c1ab");
    });

    it("givenAProjectThatShippedNothing_whenReducing_thenThereIsNoTagAndNoHash", () => {
        const signals: Map<string, SoftwareSignals> = underTest.of([profile()]);

        expect(signals.get("signale")).toMatchObject({
            latestRelease: null,
            latestCommit: null,
        });
    });

    it("givenTotalsThatCouldNotBeRead_whenReducing_thenTheCountsAreAbsentRatherThanZero", () => {
        const signals: Map<string, SoftwareSignals> = underTest.of([profile({ totals: null })]);

        expect(signals.get("signale")).toMatchObject({
            openIssues: null,
            openPullRequests: null,
        });
    });

    it("givenARepositoryThatCouldNotBeGathered_whenReducing_thenItIsSkipped", () => {
        const signals: Map<string, SoftwareSignals> = underTest.of([null, profile()]);

        expect(signals.size).toBe(1);
        expect(signals.has("signale")).toBe(true);
    });

    it("givenAHistoryOfStars_whenReducing_thenTheCardGetsTheCountsForItsCurve", () => {
        const signals: Map<string, SoftwareSignals> = underTest.of([
            profile({
                starHistory: [
                    { date: "2019-01-01T00:00:00Z", count: 100 },
                    { date: "2021-01-01T00:00:00Z", count: 900 },
                ],
            }),
        ]);

        expect(signals.get("signale")?.starHistory).toEqual([100, 900]);
    });
});
