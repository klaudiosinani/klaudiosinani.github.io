import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { GITHUB_USERNAME } from "@app/configuration/GitHubUsername";
import { RepositoryDataRetrievalService } from "@app/infrastructure/github/service/RepositoryDataRetrievalService";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import type { RepositoryDataProvider } from "@app/infrastructure/github/service/RepositoryDataProvider";

const repository: RepositoryData = {
    name: "repo",
    description: "A repository",
    url: "https://github.com/user/repo",
    stars: 1,
    forks: 0,
    language: "TypeScript",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestUpdate: "2026-01-01T00:00:00Z",
    latestPush: "2026-01-01T00:00:00Z",
};

describe("RepositoryDataRetrievalService.provide", () => {
    it("givenNoExplicitUsername_whenFetchingRepositories_thenTheConfiguredAccountIsUsed", async () => {
        const provide: Mock<RepositoryDataProvider["provide"]> = vi.fn().mockResolvedValue([repository]);
        const provider: RepositoryDataProvider = { provide };
        const underTest: RepositoryDataRetrievalService = new RepositoryDataRetrievalService(undefined, provider);

        const repositories: RepositoryData[] = await underTest.retrieve();

        expect(repositories).toEqual([repository]);
        expect(provide).toHaveBeenCalledExactlyOnceWith(GITHUB_USERNAME);
    });

    it("givenACustomUsername_whenFetchingRepositories_thenItOverridesTheDefault", async () => {
        const provide: Mock<RepositoryDataProvider["provide"]> = vi.fn().mockResolvedValue([]);
        const provider: RepositoryDataProvider = { provide };
        const underTest: RepositoryDataRetrievalService = new RepositoryDataRetrievalService("octocat", provider);

        await underTest.retrieve();

        expect(provide).toHaveBeenCalledExactlyOnceWith("octocat");
    });

    it("givenSeveralCallers_whenFetchingRepositories_thenOneRequestIsShared", async () => {
        const provide: Mock<RepositoryDataProvider["provide"]> = vi.fn().mockResolvedValue([repository]);
        const provider: RepositoryDataProvider = { provide };
        const underTest: RepositoryDataRetrievalService = new RepositoryDataRetrievalService("user", provider);

        const [first, second] = await Promise.all([underTest.retrieve(), underTest.retrieve()]);
        await underTest.retrieve();

        expect(first).toEqual([repository]);
        expect(second).toEqual([repository]);
        expect(provide).toHaveBeenCalledTimes(1);
    });

    it("givenAFailedRequest_whenFetchingRepositoriesAgain_thenTheRetrySucceeds", async () => {
        const provide: Mock<RepositoryDataProvider["provide"]> = vi
            .fn()
            .mockRejectedValueOnce(new Error("GitHub API error"))
            .mockResolvedValueOnce([repository]);
        const provider: RepositoryDataProvider = { provide };
        const underTest: RepositoryDataRetrievalService = new RepositoryDataRetrievalService("user", provider);

        await expect(underTest.retrieve()).rejects.toThrow("GitHub API error");
        await expect(underTest.retrieve()).resolves.toEqual([repository]);
        expect(provide).toHaveBeenCalledTimes(2);
    });
});
