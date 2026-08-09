import { describe, expect, it, vi } from "vitest";
import { GITHUB_USERNAME } from "@config/site";
import { RepositoryDataRetrievalService } from "@services/github/RepositoryDataRetrievalService";
import type { RepositoryData } from "@services/github/RepositoryData";
import type { RepositoryDataProvider } from "@services/github/RepositoryDataProvider";

const repository: RepositoryData = {
  name: "repo",
  description: "A repository",
  url: "https://github.com/user/repo",
  stars: 1,
  forks: 0,
  language: "TypeScript",
  latestUpdate: "2026-01-01T00:00:00Z",
};

describe("RepositoryDataRetrievalService.provide", () => {
  it("givenNoExplicitUsername_whenFetchingRepositories_thenTheConfiguredAccountIsUsed", async () => {
    // given
    const provide = vi.fn().mockResolvedValue([repository]);
    const provider: RepositoryDataProvider = { provide };
    const underTest = new RepositoryDataRetrievalService(undefined, provider);

    // when
    const repositories = await underTest.retrieve();

    // then
    expect(repositories).toEqual([repository]);
    expect(provide).toHaveBeenCalledExactlyOnceWith(GITHUB_USERNAME);
  });

  it("givenACustomUsername_whenFetchingRepositories_thenItOverridesTheDefault", async () => {
    // given
    const provide = vi.fn().mockResolvedValue([]);
    const provider: RepositoryDataProvider = { provide };
    const underTest = new RepositoryDataRetrievalService("octocat", provider);

    // when
    await underTest.retrieve();

    // then
    expect(provide).toHaveBeenCalledExactlyOnceWith("octocat");
  });

  it("givenSeveralCallers_whenFetchingRepositories_thenOneRequestIsShared", async () => {
    // given
    const provide = vi.fn().mockResolvedValue([repository]);
    const provider: RepositoryDataProvider = { provide };
    const underTest = new RepositoryDataRetrievalService("user", provider);

    // when
    const [first, second] = await Promise.all([
      underTest.retrieve(),
      underTest.retrieve(),
    ]);
    await underTest.retrieve();

    // then
    expect(first).toEqual([repository]);
    expect(second).toEqual([repository]);
    expect(provide).toHaveBeenCalledTimes(1);
  });

  it("givenAFailedRequest_whenFetchingRepositoriesAgain_thenTheRetrySucceeds", async () => {
    // given
    const provide = vi
      .fn()
      .mockRejectedValueOnce(new Error("GitHub API error"))
      .mockResolvedValueOnce([repository]);
    const provider: RepositoryDataProvider = { provide };
    const underTest = new RepositoryDataRetrievalService("user", provider);

    // when & then
    await expect(underTest.retrieve()).rejects.toThrow("GitHub API error");
    await expect(underTest.retrieve()).resolves.toEqual([repository]);
    expect(provide).toHaveBeenCalledTimes(2);
  });
});
