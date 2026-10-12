import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { GitHubContributionsProvider } from "@app/feature/impact/service/github/GitHubContributionsProvider";

import type { ContributionTotals } from "@app/feature/impact/service/github/ContributionTotals";
const TODAY: Date = new Date("2026-08-11T00:00:00Z");

const underTest: GitHubContributionsProvider = new GitHubContributionsProvider(TODAY);

const graph = (data: unknown): Response => new Response(JSON.stringify({ data }), { status: 200 });

const collection = (visible: number, restricted: number, active: number = 0) =>
    graph({
        user: {
            contributionsCollection: {
                totalCommitContributions: visible,
                restrictedContributionsCount: restricted,
                contributionCalendar: {
                    weeks: [
                        {
                            contributionDays: Array.from({ length: 7 }, (_: unknown, day: number) => ({
                                contributionCount: day < active ? 1 : 0,
                            })),
                        },
                    ],
                },
            },
        },
    });

interface Spied {
    mock: { calls: unknown[][] };
}

const bodies = (fetched: Spied): string[] =>
    fetched.mock.calls.map(([, init]: unknown[]) => String((init as RequestInit)?.body));

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

describe("GitHubContributionsProvider.commits", () => {
    it("givenNoToken_whenCountingCommits_thenItDefersRatherThanReportingZero", async () => {
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        const totals: ContributionTotals | null = await underTest.contributions("user", "year");

        expect(totals).toBeNull();
        expect(fetched).not.toHaveBeenCalled();
    });

    it("givenAToken_whenCountingCommits_thenPrivateContributionsAreIncluded", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(collection(250, 138)));

        const totals: ContributionTotals | null = await underTest.contributions("user", "year");

        expect(totals?.commits).toBe(388);
    });

    it("givenAWindow_whenCountingCommits_thenItIsBoundedToThatWindow", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockImplementation(() => Promise.resolve(collection(9, 5)));

        await underTest.contributions("user", "month");

        expect(bodies(fetched)[0]).toContain("2026-07-12");
    });

    it("givenAllTime_whenCountingCommits_thenTheYearLimitIsWalkedFromJoining", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        let call: number = 0;
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch").mockImplementation(() => {
            call += 1;

            return Promise.resolve(
                call === 1 ? graph({ user: { createdAt: "2024-08-11T00:00:00Z" } }) : collection(100, 50)
            );
        });

        const totals: ContributionTotals | null = await underTest.contributions("user", "all");

        expect(fetched.mock.calls.length).toBeGreaterThan(2);
        expect(totals?.commits).toBeGreaterThanOrEqual(300);
    });

    it("givenOneYearThatFailsAndThenAnswers_whenCountingAllTime_thenItIsNotLost", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        let call: number = 0;
        vi.spyOn(globalThis, "fetch").mockImplementation(() => {
            call += 1;

            if (call === 1) {
                return Promise.resolve(graph({ user: { createdAt: "2024-08-11T00:00:00Z" } }));
            }

            return Promise.resolve(call === 2 ? new Response("nope", { status: 502 }) : collection(100, 50));
        });
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const totals: ContributionTotals | null = await underTest.contributions("user", "all");

        expect(totals?.commits).toBe(300);
    });

    it("givenOneYearFailingThroughout_whenCountingAllTime_thenTheRestStillCounts", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        let call: number = 0;
        vi.spyOn(globalThis, "fetch").mockImplementation(() => {
            call += 1;

            if (call === 1) {
                return Promise.resolve(graph({ user: { createdAt: "2024-08-11T00:00:00Z" } }));
            }

            return Promise.resolve(call <= 4 ? new Response("nope", { status: 502 }) : collection(100, 50));
        });
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const totals: ContributionTotals | null = await underTest.contributions("user", "all");

        expect(totals?.commits).toBe(150);
    });

    it("givenAResponseWithoutData_whenCountingCommits_thenItDefers", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
        );

        const totals: ContributionTotals | null = await underTest.contributions("user", "year");

        expect(totals).toBeNull();
    });

    it("givenAnUnknownAccount_whenCountingAllTime_thenItDefers", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(graph({ user: null })));

        const totals: ContributionTotals | null = await underTest.contributions("user", "all");

        expect(totals).toBeNull();
    });

    it("givenGraphqlErrors_whenCountingCommits_thenItDefers", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                new Response(JSON.stringify({ errors: [{ message: "bad scope" }] }), {
                    status: 200,
                })
            )
        );
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const totals: ContributionTotals | null = await underTest.contributions("user", "year");

        expect(totals).toBeNull();
    });

    it("givenARefusedRequest_whenCountingCommits_thenItDefers", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(new Response("nope", { status: 401 })));
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const totals: ContributionTotals | null = await underTest.contributions("user", "year");

        expect(totals).toBeNull();
    });

    it("givenAnUnreachableApi_whenCountingCommits_thenItDefers", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const totals: ContributionTotals | null = await underTest.contributions("user", "month");

        expect(totals).toBeNull();
    });

    it("givenAToken_whenCountingCommits_thenTheRequestIsAuthorised", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockImplementation(() => Promise.resolve(collection(1, 1)));

        await underTest.contributions("user", "month");

        const [, init] = fetched.mock.calls[0];
        expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer secret");
    });

    it("givenTheDefaultClock_whenConstructed_thenItStillDefersWithoutAToken", async () => {
        const totals: ContributionTotals | null = await new GitHubContributionsProvider().contributions("user", "year");

        expect(totals).toBeNull();
    });
});

describe("GitHubContributionsProvider active days", () => {
    it("givenAContributionCalendar_whenCounting_thenOnlyDaysWithWorkCount", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(collection(10, 5, 3)));

        const totals: ContributionTotals | null = await underTest.contributions("user", "month");

        expect(totals?.activeDays).toBe(3);
    });

    it("givenNoCalendar_whenCounting_thenNoDayIsCountedActive", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                graph({
                    user: {
                        contributionsCollection: {
                            totalCommitContributions: 4,
                            restrictedContributionsCount: 1,
                        },
                    },
                })
            )
        );

        const totals: ContributionTotals | null = await underTest.contributions("user", "month");

        expect(totals).toEqual({ commits: 5, activeDays: 0, days: [] });
    });
});

describe("GitHubContributionsProvider calendar", () => {
    it("givenACalendar_whenReading_thenEachDayIsKeptForTheChart", async () => {
        vi.stubEnv("GITHUB_CONTRIBUTIONS_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                graph({
                    user: {
                        contributionsCollection: {
                            totalCommitContributions: 2,
                            restrictedContributionsCount: 0,
                            contributionCalendar: {
                                weeks: [
                                    {
                                        contributionDays: [
                                            { contributionCount: 2, date: "2026-08-19" },
                                            { contributionCount: 0, date: "2026-08-20" },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                })
            )
        );

        const totals: ContributionTotals | null = await underTest.contributions("user", "month");

        expect(totals?.days).toEqual([
            { date: "2026-08-19", count: 2 },
            { date: "2026-08-20", count: 0 },
        ]);
    });
});
