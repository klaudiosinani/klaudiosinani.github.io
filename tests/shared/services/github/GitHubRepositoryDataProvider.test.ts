import { afterEach, describe, expect, it, vi } from "vitest";
import { GitHubRepositoryDataProvider } from "@services/github/GitHubRepositoryDataProvider";

const underTest = new GitHubRepositoryDataProvider();

interface GitHubRepositoryFixture {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

const repository = (
  overrides: Partial<GitHubRepositoryFixture> = {}
): GitHubRepositoryFixture => ({
  name: "repo",
  description: "A repository",
  html_url: "https://github.com/user/repo",
  stargazers_count: 1,
  forks_count: 0,
  language: "TypeScript",
  updated_at: "2026-01-01T00:00:00Z",
  ...overrides,
});

const jsonResponse = (body: unknown): Response =>
  new Response(JSON.stringify(body), { status: 200 });

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GitHubRepositoryDataProvider.provide", () => {
  it("givenAGitHubPayload_whenFetchingRepositories_thenItIsMappedOntoTheDomainModel", async () => {
    // given
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse([
        repository({
          name: "signale",
          description: "Logging utility",
          html_url: "https://github.com/user/signale",
          stargazers_count: 9000,
          forks_count: 200,
          language: "JavaScript",
          updated_at: "2026-02-01T00:00:00Z",
        }),
      ])
    );

    // when
    const repositories = await underTest.provide("user");

    // then
    expect(repositories).toEqual([
      {
        name: "signale",
        description: "Logging utility",
        url: "https://github.com/user/signale",
        stars: 9000,
        forks: 200,
        language: "JavaScript",
        latestUpdate: "2026-02-01T00:00:00Z",
      },
    ]);
  });

  it("givenAnAccount_whenFetchingRepositories_thenTheApiVersionIsPinned", async () => {
    // given
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse([]));

    // when
    await underTest.provide("octocat");

    // then
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(
      "https://api.github.com/users/octocat/repos?per_page=100&page=1",
      { headers: { "X-GitHub-Api-Version": "2022-11-28" } }
    );
  });

  it("givenARepositoryWithoutADescription_whenFetchingRepositories_thenNullBecomesAnEmptyString", async () => {
    // given
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse([repository({ description: null })])
    );

    // when
    const [mapped] = await underTest.provide("user");

    // then
    expect(mapped.description).toBe("");
  });

  it("givenRepositoriesInArbitraryOrder_whenFetchingRepositories_thenTheyAreSortedByStarsDescending", async () => {
    // given
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse([
        repository({ name: "small", stargazers_count: 1 }),
        repository({ name: "large", stargazers_count: 100 }),
        repository({ name: "medium", stargazers_count: 10 }),
      ])
    );

    // when
    const repositories = await underTest.provide("user");

    // then
    expect(repositories.map(({ name }) => name)).toEqual([
      "large",
      "medium",
      "small",
    ]);
  });

  it("givenEqualStarCounts_whenFetchingRepositories_thenTiesAreBrokenByName", async () => {
    // given
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse([
        repository({ name: "zebra", stargazers_count: 5 }),
        repository({ name: "alpha", stargazers_count: 5 }),
      ])
    );

    // when
    const repositories = await underTest.provide("user");

    // then
    expect(repositories.map(({ name }) => name)).toEqual(["alpha", "zebra"]);
  });

  it("givenAFullPageFollowedByAPartialOne_whenFetchingRepositories_thenBothAreCollected", async () => {
    // given
    const fullPage = Array.from({ length: 100 }, (_, index) =>
      repository({ name: `repo-${String(index).padStart(3, "0")}` })
    );
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse(fullPage))
      .mockResolvedValueOnce(jsonResponse([repository({ name: "last" })]));

    // when
    const repositories = await underTest.provide("user");

    // then
    expect(repositories).toHaveLength(101);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy).toHaveBeenLastCalledWith(
      "https://api.github.com/users/user/repos?per_page=100&page=2",
      { headers: { "X-GitHub-Api-Version": "2022-11-28" } }
    );
  });

  it("givenAnAccountThatNeverReturnsAShortPage_whenFetchingRepositories_thenTheWalkStopsAtTheCapAndWarns", async () => {
    // given
    const fullPage = Array.from({ length: 100 }, (_, index) =>
      repository({ name: `repo-${String(index).padStart(3, "0")}` })
    );
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => jsonResponse(fullPage));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // when
    const repositories = await underTest.provide("user");

    // then
    expect(repositories).toHaveLength(1000);
    expect(fetchSpy).toHaveBeenCalledTimes(10);
    expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
      expect.stringContaining("truncated at 1000")
    );
  });

  it("givenARejectedRequest_whenFetchingRepositories_thenItThrows", async () => {
    // given
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("rate limited", { status: 403, statusText: "Forbidden" })
    );

    await expect(underTest.provide("user")).rejects.toThrow(
      "GitHub API error: 403 - Forbidden"
    );
  });
});
