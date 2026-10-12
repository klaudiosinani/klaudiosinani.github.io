import { afterEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { GitHubSearchProvider } from "@app/feature/impact/service/github/GitHubSearchProvider";

import type { IssueTotals } from "@app/feature/impact/service/github/IssueTotals";
import type { OpenTotals } from "@app/feature/impact/OpenTotals";
const TODAY: Date = new Date("2026-08-11T00:00:00Z");

const underTest: GitHubSearchProvider = new GitHubSearchProvider(TODAY);

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const searching = (counts: Record<string, number>) =>
    vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) => {
        const path: string = decodeURIComponent(String(input));
        const matched: [string, number] | undefined = Object.entries(counts).find(([fragment]: [string, number]) =>
            path.includes(fragment)
        );

        return Promise.resolve(jsonResponse({ total_count: matched ? matched[1] : 0 }));
    });

const queries = (fetched: ReturnType<typeof searching>): string[] =>
    fetched.mock.calls.map(([url]: [input: string | URL | Request, init?: RequestInit | undefined]) =>
        decodeURIComponent(String(url))
    );

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

describe("GitHubSearchProvider.contributions", () => {
    it("givenAWindow_whenCountingContributions_thenEveryFigureIsScopedToTheAccount", async () => {
        const fetched: Mock<typeof fetch> = searching({ "": 7 });

        await underTest.contributions("user", "year");

        expect(queries(fetched).every((query: string) => query.includes("user:user"))).toBe(true);
    });

    it("givenAWindow_whenCountingCommits_thenTheyAreScopedToTheAuthorAndTheCommitIndex", async () => {
        const fetched: Mock<typeof fetch> = searching({
            "search/commits": 250,
        });

        const { commits } = await underTest.contributions("user", "year");

        expect(commits).toBe(250);
        const commitQuery: string | undefined = queries(fetched).find((q: string) => q.includes("search/commits"));
        expect(commitQuery).toContain("author:user");
        expect(commitQuery).toContain("author-date:>=2025-08-11");
    });

    it("givenAWindow_whenCountingPullRequests_thenOpenedAndClosedAreSeparate", async () => {
        searching({ "is:pr is:closed": 178, "is:pr ": 146 });

        const totals: IssueTotals = await underTest.contributions("user", "year");

        expect(totals.pullRequestsOpened).toBe(146);
        expect(totals.pullRequestsClosed).toBe(178);
    });

    it("givenAWindow_whenCountingIssues_thenOpenedAndClosedAreSeparate", async () => {
        searching({ "is:issue is:closed": 4, "is:issue ": 2 });

        const totals: IssueTotals = await underTest.contributions("user", "year");

        expect(totals.issuesOpened).toBe(2);
        expect(totals.issuesClosed).toBe(4);
    });

    it("givenTheMonthWindow_whenCountingContributions_thenThirtyDaysAreRequested", async () => {
        const fetched: Mock<typeof fetch> = searching({ "": 1 });

        await underTest.contributions("user", "month");

        expect(queries(fetched).some((q: string) => q.includes("created:>=2026-07-12"))).toBe(true);
    });

    it("givenTheAllTimeWindow_whenCountingContributions_thenNoDateBoundIsApplied", async () => {
        searching({ "search/commits": 2727 });

        const { commits } = await underTest.contributions("user", "all");

        expect(commits).toBe(2727);
    });

    it("givenAFailingSearch_whenCountingContributions_thenZeroesAreReported", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(new Response("nope", { status: 422 })));
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const totals: IssueTotals = await underTest.contributions("user", "month");

        expect(totals).toEqual({
            commits: 0,
            pullRequestsOpened: 0,
            pullRequestsClosed: 0,
            issuesOpened: 0,
            issuesClosed: 0,
        });
    });
});

describe("GitHubSearchProvider.open", () => {
    it("givenOpenWork_whenCounting_thenPullRequestsAndIssuesAreSeparated", async () => {
        searching({ "is:pr is:open": 82, "is:issue is:open": 445 });

        const totals: OpenTotals = await underTest.open("user");

        expect(totals).toEqual({ openPullRequests: 82, openIssues: 445 });
    });
});

describe("GitHubSearchProvider construction", () => {
    it("givenTheDefaultClock_whenCountingContributions_thenItStillQueries", async () => {
        searching({ "search/commits": 3 });

        const { commits } = await new GitHubSearchProvider().contributions("user", "month");

        expect(commits).toBe(3);
    });

    it("givenThePreviousWindow_whenCounting_thenTheQueryUsesARangeWithBothEnds", async () => {
        const queries: string[] = [];
        vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) => {
            queries.push(decodeURIComponent(String(input)));
            return Promise.resolve(new Response(JSON.stringify({ total_count: 1 }), { status: 200 }));
        });

        await underTest.contributions("klaudiosinani", "month", 1);

        expect(queries.some((query: string) => query.includes(".."))).toBe(true);
        expect(queries.every((query: string) => !query.includes(":>="))).toBe(true);
    });
});
