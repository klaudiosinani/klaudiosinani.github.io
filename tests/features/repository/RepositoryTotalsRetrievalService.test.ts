import { describe, expect, it, vi } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import type { Mock } from "vitest";
import { RepositoryTotalsRetrievalService } from "@app/feature/repository/service/RepositoryTotalsRetrievalService";
import type { RepositoryTotalsProvider } from "@app/feature/repository/service/RepositoryTotalsProvider";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import type { RepositoryTotals } from "@app/feature/repository/RepositoryTotals";
import type { RetrievalService } from "@app/infrastructure/RetrievalService";

const totals = (openIssues: number): RepositoryTotals => ({
    commits: 128,
    openIssues,
    closedIssues: 0,
    openPullRequests: 0,
    mergedPullRequests: 0,
});

const repository = (name: string): RepositoryData => ({
    name,
    description: "",
    url: `https://github.com/klaudiosinani/${name}`,
    stars: 0,
    forks: 0,
    language: null,
    latestUpdate: "2026-08-01T00:00:00Z",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestPush: "2026-08-01T00:00:00Z",
});

const listing = (names: string[]): RetrievalService<RepositoryData> => ({
    retrieve: () => Promise.resolve(names.map(repository)),
});

const providerOf = (all: RepositoryTotalsProvider["all"]): RepositoryTotalsProvider =>
    ({ all }) as RepositoryTotalsProvider;

describe("RepositoryTotalsRetrievalService.of", () => {
    it("givenAPagePerRepository_whenEachAsks_thenTheBatchIsGatheredOnce", async () => {
        const all: Mock<() => Promise<Map<string, RepositoryTotals>>> = vi.fn(() =>
            Promise.resolve(
                new Map([
                    ["signale", totals(29)],
                    ["taskbook", totals(4)],
                ])
            )
        );
        const underTest: RepositoryTotalsRetrievalService = new RepositoryTotalsRetrievalService(
            listing(["signale", "taskbook"]),
            providerOf(all)
        );

        const [first, second] = await Promise.all([
            underTest.of(new RepositoryRef("klaudiosinani", "signale")),
            underTest.of(new RepositoryRef("klaudiosinani", "taskbook")),
        ]);

        expect(all).toHaveBeenCalledTimes(1);
        expect(first?.openIssues).toBe(29);
        expect(second?.openIssues).toBe(4);
    });

    it("givenTheBatch_whenGathering_thenEveryRepositoryNameIsAskedForAtOnce", async () => {
        const all: Mock<() => Promise<Map<string, RepositoryTotals>>> = vi.fn(() =>
            Promise.resolve(new Map<string, RepositoryTotals>())
        );
        const underTest: RepositoryTotalsRetrievalService = new RepositoryTotalsRetrievalService(
            listing(["signale", "taskbook"]),
            providerOf(all)
        );

        await underTest.of(new RepositoryRef("klaudiosinani", "signale"));

        expect(all).toHaveBeenCalledWith("klaudiosinani", ["signale", "taskbook"]);
    });

    it("givenARepositoryMissingFromTheBatch_whenAsked_thenNothingIsReturned", async () => {
        const underTest: RepositoryTotalsRetrievalService = new RepositoryTotalsRetrievalService(
            listing(["signale"]),
            providerOf(() => Promise.resolve(new Map()))
        );

        const gathered: RepositoryTotals | null = await underTest.of(new RepositoryRef("klaudiosinani", "signale"));

        expect(gathered).toBeNull();
    });

    it("givenAFailedBatch_whenAskingAgain_thenItIsRetriedRatherThanInheritingTheFailure", async () => {
        const all: Mock<(username: string, slugs: readonly string[]) => Promise<Map<string, RepositoryTotals>>> = vi
            .fn<RepositoryTotalsProvider["all"]>()
            .mockRejectedValueOnce(new Error("rate limited"))
            .mockResolvedValueOnce(new Map([["signale", totals(29)]]));
        const underTest: RepositoryTotalsRetrievalService = new RepositoryTotalsRetrievalService(
            listing(["signale"]),
            providerOf(all)
        );

        await expect(underTest.of(new RepositoryRef("klaudiosinani", "signale"))).rejects.toThrow("rate limited");
        const retried: RepositoryTotals | null = await underTest.of(new RepositoryRef("klaudiosinani", "signale"));

        expect(all).toHaveBeenCalledTimes(2);
        expect(retried?.openIssues).toBe(29);
    });

    it("givenTheSharedInstance_whenAskedTwice_thenTheSameServiceIsReturned", () => {
        expect(RepositoryTotalsRetrievalService.shared()).toBe(RepositoryTotalsRetrievalService.shared());
    });
});
