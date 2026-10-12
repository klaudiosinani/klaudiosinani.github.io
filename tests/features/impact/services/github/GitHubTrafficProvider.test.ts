import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { GitHubTrafficProvider } from "@app/feature/impact/service/github/GitHubTrafficProvider";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";

import type { TrafficMetrics } from "@app/feature/impact/TrafficMetrics";
const repository = (name: string): RepositoryData => ({
    name,
    description: "",
    url: `https://github.com/user/${name}`,
    stars: 0,
    forks: 0,
    language: null,
    latestUpdate: "2026-01-01T00:00:00Z",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestPush: "2026-01-01T00:00:00Z",
});

const underTest: GitHubTrafficProvider = new GitHubTrafficProvider();

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

describe("GitHubTrafficProvider.traffic", () => {
    it("givenNoTrafficToken_whenReadingTraffic_thenItIsReportedAsUnavailable", async () => {
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        const traffic: TrafficMetrics | null = await underTest.traffic("user", [repository("one")]);

        expect(traffic).toBeNull();
        expect(fetched).not.toHaveBeenCalled();
    });

    it("givenATrafficToken_whenReadingTraffic_thenEveryRepositoryIsSummed", async () => {
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) =>
            Promise.resolve(jsonResponse(String(input).includes("/views") ? { count: 100, uniques: 40 } : { count: 7 }))
        );

        const traffic: TrafficMetrics | null = await underTest.traffic("user", [repository("one"), repository("two")]);

        expect(traffic).toEqual({ views: 200, uniqueVisitors: 80, clones: 14 });
    });

    it("givenATrafficTokenAndAFailingApi_whenReadingTraffic_thenZeroesAreReported", async () => {
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "secret");
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(new Response("nope", { status: 403 })));
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const traffic: TrafficMetrics | null = await underTest.traffic("user", [repository("one")]);

        expect(traffic).toEqual({ views: 0, uniqueVisitors: 0, clones: 0 });
    });

    it("givenATrafficToken_whenReadingTraffic_thenTheRequestIsAuthorised", async () => {
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "secret");
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockImplementation(() => Promise.resolve(jsonResponse({ count: 1, uniques: 1 })));

        await underTest.traffic("user", [repository("one")]);

        const [, init] = fetched.mock.calls[0];
        expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer secret");
    });

    it("givenNoRepositories_whenGathering_thenEveryFigureIsZeroAndNothingThrows", async () => {
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "a-token");

        const traffic: TrafficMetrics | null = await underTest.traffic("klaudiosinani", []);

        expect(traffic).toEqual({ views: 0, uniqueVisitors: 0, clones: 0 });
    });

    it("givenSeveralRepositories_whenGathering_thenViewsAreSummedEvenThoughNoPageShowsThem", async () => {
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "a-token");
        vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) =>
            Promise.resolve(
                new Response(
                    JSON.stringify(String(input).includes("/views") ? { count: 100, uniques: 40 } : { count: 7 }),
                    { status: 200 }
                )
            )
        );

        const traffic: TrafficMetrics | null = await underTest.traffic("klaudiosinani", [
            repository("signale"),
            repository("taskbook"),
        ]);

        expect(traffic).toEqual({ views: 200, uniqueVisitors: 80, clones: 14 });
    });
});
