import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { GitHubRepositoryDataProvider } from "@app/infrastructure/github/service/GitHubRepositoryDataProvider";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";

const underTest: GitHubRepositoryDataProvider = new GitHubRepositoryDataProvider();

interface GitHubRepositoryFixture {
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    license: { spdx_id: string | null; name: string } | null;
    topics?: string[];
    created_at: string;
    updated_at: string;
    pushed_at: string;
}

const repository = (overrides: Partial<GitHubRepositoryFixture> = {}): GitHubRepositoryFixture => ({
    name: "repo",
    description: "A repository",
    html_url: "https://github.com/user/repo",
    stargazers_count: 1,
    forks_count: 0,
    language: "TypeScript",
    license: { spdx_id: "MIT", name: "MIT License" },
    topics: ["cli"],
    created_at: "2018-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    pushed_at: "2026-01-01T00:00:00Z",
    ...overrides,
});

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const sent = (fetched: MockInstance<typeof fetch>, call: number = 0): Request => fetched.mock.calls[call][0] as Request;

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

describe("GitHubRepositoryDataProvider.provide", () => {
    it("givenAGitHubPayload_whenFetchingRepositories_thenItIsMappedOntoTheDomainModel", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse([
                repository({
                    name: "signale",
                    description: "Logging utility",
                    html_url: "https://github.com/user/signale",
                    stargazers_count: 9000,
                    forks_count: 200,
                    language: "JavaScript",
                    license: { spdx_id: "MIT", name: "MIT License" },
                    topics: ["logging", "cli"],
                    created_at: "2017-10-01T00:00:00Z",
                    updated_at: "2026-02-01T00:00:00Z",
                    pushed_at: "2026-02-02T00:00:00Z",
                }),
            ])
        );

        const repositories: RepositoryData[] = await underTest.provide("user");

        expect(repositories).toEqual([
            {
                name: "signale",
                description: "Logging utility",
                url: "https://github.com/user/signale",
                stars: 9000,
                forks: 200,
                language: "JavaScript",
                license: "MIT",
                topics: ["logging", "cli"],
                createdAt: "2017-10-01T00:00:00Z",
                latestUpdate: "2026-02-01T00:00:00Z",
                latestPush: "2026-02-02T00:00:00Z",
            },
        ]);
    });

    it("givenAnAccount_whenFetchingRepositories_thenTheApiVersionIsPinned", async () => {
        const fetchSpy: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([]));

        await underTest.provide("octocat");

        const request: Request = sent(fetchSpy);
        expect(request.method).toBe("GET");
        expect(request.url).toBe("https://api.github.com/users/octocat/repos?per_page=100&page=1");
        expect(request.headers.get("X-GitHub-Api-Version")).toBe("2022-11-28");
    });

    it("givenAConfiguredToken_whenFetchingRepositories_thenTheRequestIsAuthenticated", async () => {
        vi.stubEnv("GITHUB_TOKEN", "secret");
        const fetchSpy: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([]));

        await underTest.provide("octocat");

        const request: Request = sent(fetchSpy);
        expect(request.headers.get("X-GitHub-Api-Version")).toBe("2022-11-28");
        expect(request.headers.get("Authorization")).toBe("Bearer secret");
    });

    it("givenARepositoryWithoutADescription_whenFetchingRepositories_thenNullBecomesAnEmptyString", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([repository({ description: null })]));

        const [mapped] = await underTest.provide("user");

        expect(mapped.description).toBe("");
    });

    it("givenRepositoriesInArbitraryOrder_whenFetchingRepositories_thenTheyAreSortedByStarsDescending", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse([
                repository({ name: "small", stargazers_count: 1 }),
                repository({ name: "large", stargazers_count: 100 }),
                repository({ name: "medium", stargazers_count: 10 }),
            ])
        );

        const repositories: RepositoryData[] = await underTest.provide("user");

        expect(repositories.map(({ name }: RepositoryData) => name)).toEqual(["large", "medium", "small"]);
    });

    it("givenEqualStarCounts_whenFetchingRepositories_thenTiesAreBrokenByName", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse([
                repository({ name: "zebra", stargazers_count: 5 }),
                repository({ name: "alpha", stargazers_count: 5 }),
            ])
        );

        const repositories: RepositoryData[] = await underTest.provide("user");

        expect(repositories.map(({ name }: RepositoryData) => name)).toEqual(["alpha", "zebra"]);
    });

    it("givenAFullPageFollowedByAPartialOne_whenFetchingRepositories_thenBothAreCollected", async () => {
        const fullPage: GitHubRepositoryFixture[] = Array.from({ length: 100 }, (_: unknown, index: number) =>
            repository({ name: `repo-${String(index).padStart(3, "0")}` })
        );
        const fetchSpy: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(jsonResponse(fullPage))
            .mockResolvedValueOnce(jsonResponse([repository({ name: "last" })]));

        const repositories: RepositoryData[] = await underTest.provide("user");

        expect(repositories).toHaveLength(101);
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(sent(fetchSpy, 1).url).toBe("https://api.github.com/users/user/repos?per_page=100&page=2");
    });

    it("givenAnAccountThatNeverReturnsAShortPage_whenFetchingRepositories_thenTheWalkStopsAtTheCapAndWarns", async () => {
        const fullPage: GitHubRepositoryFixture[] = Array.from({ length: 100 }, (_: unknown, index: number) =>
            repository({ name: `repo-${String(index).padStart(3, "0")}` })
        );
        const fetchSpy: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockImplementation(async () => jsonResponse(fullPage));
        const warnSpy: MockInstance<(...data: unknown[]) => void> = vi
            .spyOn(console, "warn")
            .mockImplementation(() => {});

        const repositories: RepositoryData[] = await underTest.provide("user");

        expect(repositories).toHaveLength(1000);
        expect(fetchSpy).toHaveBeenCalledTimes(10);
        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(expect.stringContaining("truncated at 1000"));
    });

    it("givenALicenceGitHubCouldNotIdentify_whenFetchingRepositories_thenItsFullNameIsUsed", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse([
                repository({
                    license: { spdx_id: "NOASSERTION", name: "Custom terms" },
                }),
            ])
        );

        const [mapped] = await underTest.provide("user");

        expect(mapped.license).toBe("Custom terms");
    });

    it("givenARepositoryStatingNoLicence_whenFetchingRepositories_thenItHasNone", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([repository({ license: null })]));

        const [mapped] = await underTest.provide("user");

        expect(mapped.license).toBeNull();
    });

    it("givenAPayloadWithoutTopics_whenFetchingRepositories_thenTheListIsEmpty", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([repository({ topics: undefined })]));

        const [mapped] = await underTest.provide("user");

        expect(mapped.topics).toEqual([]);
    });

    it("givenAnUnreachableApi_whenFetchingRepositories_thenItThrows", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

        await expect(underTest.provide("user")).rejects.toThrow("GitHub API error: the repository list is unreachable");
    });

    it("givenARejectedRequest_whenFetchingRepositories_thenItThrows", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("rate limited", { status: 403 }));

        await expect(underTest.provide("user")).rejects.toThrow(
            "GitHub API error: 403 - users/user/repos?per_page=100&page=1"
        );
    });
});
