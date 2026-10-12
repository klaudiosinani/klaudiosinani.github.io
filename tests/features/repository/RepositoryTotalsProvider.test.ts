import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { RepositoryTotalsProvider } from "@app/feature/repository/service/RepositoryTotalsProvider";

import type { RepositoryTotals } from "@app/feature/repository/RepositoryTotals";
const underTest: RepositoryTotalsProvider = new RepositoryTotalsProvider();

const counted = (
    openIssues: number,
    closedIssues: number,
    openPullRequests: number,
    mergedPullRequests: number,
    commits: number | null = 128
) => ({
    commits: commits === null ? null : { target: { history: { totalCount: commits } } },
    openIssues: { totalCount: openIssues },
    closedIssues: { totalCount: closedIssues },
    openPullRequests: { totalCount: openPullRequests },
    mergedPullRequests: { totalCount: mergedPullRequests },
});

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const authenticated = (): void => {
    vi.stubEnv("GITHUB_TOKEN", "a-token");
};

const answering = (data: unknown): string[] => {
    const documents: string[] = [];

    vi.spyOn(globalThis, "fetch").mockImplementation((_input: RequestInfo | URL, init?: RequestInit) => {
        documents.push(JSON.parse(String(init?.body)).query);
        return Promise.resolve(jsonResponse({ data }));
    });

    return documents;
};

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

describe("RepositoryTotalsProvider.all", () => {
    it("givenNoToken_whenGathering_thenNothingIsReturnedAndNoRequestIsMade", async () => {
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", ["signale"]);

        expect(totals.size).toBe(0);
        expect(fetched).not.toHaveBeenCalled();
    });

    it("givenNoRepositories_whenGathering_thenNoRequestIsMade", async () => {
        authenticated();
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", []);

        expect(totals.size).toBe(0);
        expect(fetched).not.toHaveBeenCalled();
    });

    it("givenSeveralRepositories_whenGathering_thenOneRequestCarriesThemAll", async () => {
        authenticated();
        const documents: string[] = answering({
            r0: counted(29, 42, 10, 43),
            r1: counted(1, 2, 3, 4),
        });

        await underTest.all("klaudiosinani", ["signale", "taskbook"]);

        expect(documents).toHaveLength(1);
        expect(documents[0]).toContain('r0: repository(owner: "klaudiosinani", name: "signale")');
        expect(documents[0]).toContain('r1: repository(owner: "klaudiosinani", name: "taskbook")');
    });

    it("givenCounts_whenGathering_thenEachLandsOnItsOwnRepository", async () => {
        authenticated();
        answering({ r0: counted(29, 42, 10, 43), r1: counted(1, 2, 3, 4) });

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", ["signale", "taskbook"]);

        expect(totals.get("signale")).toEqual({
            commits: 128,
            openIssues: 29,
            closedIssues: 42,
            openPullRequests: 10,
            mergedPullRequests: 43,
        });
        expect(totals.get("taskbook")?.mergedPullRequests).toBe(4);
    });

    it("givenACommitCount_whenGathering_thenItComesFromTheDefaultBranch", async () => {
        authenticated();
        const documents: string[] = answering({ r0: counted(0, 0, 0, 0, 4_210) });

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", ["signale"]);

        expect(totals.get("signale")?.commits).toBe(4_210);
        expect(documents[0]).toContain("defaultBranchRef");
    });

    it("givenARepositoryWithNoCommit_whenGathering_thenTheCountIsNothing", async () => {
        authenticated();
        answering({ r0: counted(0, 0, 0, 0, null) });

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", ["signale"]);

        expect(totals.get("signale")?.commits).toBe(0);
    });

    it("givenNamesThatAreNotLegalAliases_whenGathering_thenPositionalAliasesAreUsed", async () => {
        authenticated();
        const documents: string[] = answering({ r0: counted(0, 0, 0, 0) });

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", ["klaudiosinani.github.io"]);

        expect(documents[0]).toContain("r0: repository");
        expect(totals.has("klaudiosinani.github.io")).toBe(true);
    });

    it("givenOneRepositoryMissing_whenGathering_thenTheOthersAreStillKept", async () => {
        authenticated();
        answering({ r0: null, r1: counted(1, 2, 3, 4) });

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", ["gone", "taskbook"]);

        expect(totals.has("gone")).toBe(false);
        expect(totals.has("taskbook")).toBe(true);
    });

    it("givenMoreRepositoriesThanOneBatchHolds_whenGathering_thenTheyAreSplitAcrossDocuments", async () => {
        authenticated();
        const slugs: string[] = Array.from({ length: 30 }, (_unused: unknown, index: number) => `repo-${index}`);
        const documents: string[] = answering(
            Object.fromEntries(
                Array.from({ length: 25 }, (_unused: unknown, index: number) => [`r${index}`, counted(0, 0, 0, 0)])
            )
        );

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", slugs);

        expect(documents).toHaveLength(2);
        expect(totals.size).toBeGreaterThan(0);
    });

    it("givenGraphQlRefuses_whenGathering_thenNothingIsReturnedRatherThanThrowing", async () => {
        authenticated();
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("bad credentials", { status: 401 }));

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", ["signale"]);

        expect(totals.size).toBe(0);
    });

    it("givenAnErrorsOnlyBody_whenGathering_thenNothingIsReturned", async () => {
        authenticated();
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ errors: [{ message: "rate limited" }] }));

        const totals: Map<string, RepositoryTotals> = await underTest.all("klaudiosinani", ["signale"]);

        expect(totals.size).toBe(0);
    });
});
