import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { RepositorySignalsSource } from "@app/feature/repository/RepositorySignalsSource";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import type { RepositoryProfileRetrievalService } from "@app/feature/repository/service/RepositoryProfileRetrievalService";

import type { SoftwareSignals } from "@app/feature/software/SoftwareSignals";
const profile = (slug: string): RepositoryProfile => ({
    slug,
    name: slug,
    logline: "",
    description: "",
    url: `https://github.com/klaudiosinani/${slug}`,
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
        openIssues: 3,
        closedIssues: 4,
        openPullRequests: 1,
        mergedPullRequests: 2,
    },
    packages: [],
    latestCommit: null,
    languages: [{ name: "JavaScript", share: 1 }],
    contributors: null,
    clones: null,
    dependents: null,
    manual: null,
    documents: [],
    citation: null,
});

const profilesOf = (retrieve: RepositoryProfileRetrievalService["retrieve"]): RepositoryProfileRetrievalService =>
    ({ retrieve }) as RepositoryProfileRetrievalService;

describe("RepositorySignalsSource.signals", () => {
    it("givenSlugs_whenAsked_thenEachProfileBecomesItsSignals", async () => {
        const underTest: RepositorySignalsSource = new RepositorySignalsSource(
            profilesOf((slug: string) => Promise.resolve(profile(slug)))
        );

        const signals: ReadonlyMap<string, SoftwareSignals> = await underTest.signals(["signale", "taskbook"]);

        expect(signals.size).toBe(2);
        expect(signals.get("signale")).toEqual({
            languages: ["JavaScript"],
            openIssues: 3,
            openPullRequests: 1,
            latestRelease: null,
            latestCommit: null,
            starHistory: [],
        });
    });

    it("givenARepositoryThatCouldNotBeGathered_whenAsked_thenItIsLeftOut", async () => {
        const underTest: RepositorySignalsSource = new RepositorySignalsSource(profilesOf(() => Promise.resolve(null)));

        const signals: ReadonlyMap<string, SoftwareSignals> = await underTest.signals(["gone"]);

        expect(signals.size).toBe(0);
    });

    it("givenNoSlugs_whenAsked_thenNoProfileIsRequested", async () => {
        const retrieve: Mock<() => Promise<null>> = vi.fn(() => Promise.resolve(null));
        const underTest: RepositorySignalsSource = new RepositorySignalsSource(profilesOf(retrieve));

        const signals: ReadonlyMap<string, SoftwareSignals> = await underTest.signals([]);

        expect(retrieve).not.toHaveBeenCalled();
        expect(signals.size).toBe(0);
    });
});
