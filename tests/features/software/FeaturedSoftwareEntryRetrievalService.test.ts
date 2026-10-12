import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { FeaturedSoftwareEntryRetrievalService } from "@app/feature/software/service/FeaturedSoftwareEntryRetrievalService";
import type { FeaturedSoftware } from "@app/feature/software/FeaturedSoftware";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import type { RetrievalService } from "@app/infrastructure/RetrievalService";
import type { SoftwareSignals } from "@app/feature/software/SoftwareSignals";
import type { SoftwareSignalsSource } from "@app/feature/software/SoftwareSignalsSource";

const curated = (url: string, name: string = "Signale.js"): FeaturedSoftware => ({
    name,
    logline: "Highly configurable logging library",
    description: "Configurable to the core.",
    url,
    order: 1,
});

const repository = (name: string): RepositoryData => ({
    name,
    description: "",
    url: `https://github.com/klaudiosinani/${name}`,
    stars: 9179,
    forks: 231,
    language: "JavaScript",
    latestUpdate: "2026-08-01T00:00:00Z",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestPush: "2026-08-01T00:00:00Z",
});

const listing = <T>(items: T[]): RetrievalService<T> => ({
    retrieve: () => Promise.resolve(items),
});

const sourceOf = (signals: SoftwareSignalsSource["signals"]): SoftwareSignalsSource => ({ signals });

const SIGNALS: SoftwareSignals = {
    languages: ["JavaScript", "TypeScript"],
    openIssues: 29,
    openPullRequests: 10,
    latestRelease: "v1.4.0",
    latestCommit: "9f2c1ab",
    starHistory: [],
};

describe("FeaturedSoftwareEntryRetrievalService.retrieve", () => {
    it("givenTheThreeSources_whenRetrieving_thenOneEntryCarriesWordsCountsAndSignals", async () => {
        const underTest: FeaturedSoftwareEntryRetrievalService = new FeaturedSoftwareEntryRetrievalService(
            sourceOf(() => Promise.resolve(new Map([["signale", SIGNALS]]))),
            listing([curated("https://github.com/klaudiosinani/signale")]),
            listing([repository("signale")])
        );

        const [entry] = await underTest.retrieve();

        expect(entry.name).toBe("Signale.js");
        expect(entry.stars).toBe(9179);
        expect(entry.languages).toEqual(["JavaScript", "TypeScript"]);
        expect(entry.openIssues).toBe(29);
    });

    it("givenCuratedEntries_whenRetrieving_thenOnlyMatchedRepositoriesAreAskedFor", async () => {
        const signals: Mock<() => Promise<Map<string, SoftwareSignals>>> = vi.fn(() =>
            Promise.resolve(new Map<string, SoftwareSignals>())
        );
        const underTest: FeaturedSoftwareEntryRetrievalService = new FeaturedSoftwareEntryRetrievalService(
            sourceOf(signals),
            listing([
                curated("https://github.com/klaudiosinani/signale"),
                curated("https://github.com/klaudiosinani/removed", "Gone"),
            ]),
            listing([repository("signale")])
        );

        await underTest.retrieve();

        expect(signals).toHaveBeenCalledWith(["signale"]);
    });

    it("givenNoSignalsForARepository_whenRetrieving_thenTheEntryStillCarriesItsCounts", async () => {
        const underTest: FeaturedSoftwareEntryRetrievalService = new FeaturedSoftwareEntryRetrievalService(
            sourceOf(() => Promise.resolve(new Map())),
            listing([curated("https://github.com/klaudiosinani/signale")]),
            listing([repository("signale")])
        );

        const [entry] = await underTest.retrieve();

        expect(entry.stars).toBe(9179);
        expect(entry.openIssues).toBeNull();
        expect(entry.languages).toEqual(["JavaScript"]);
    });
});
