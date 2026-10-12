import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import type { AuthoredCommit } from "@app/infrastructure/github/domain/AuthoredCommit";
import { GitHubApiService } from "@app/infrastructure/github/service/GitHubApiService";
import { GitHubApiServiceFactory } from "@app/infrastructure/github/factory/GitHubApiServiceFactory";
import { GitHubAuthoredCommitProvider } from "@app/infrastructure/github/service/GitHubAuthoredCommitProvider";
import type { GitHubCommit } from "@app/infrastructure/github/dto/GitHubCommit";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";

const underTest: GitHubAuthoredCommitProvider = new GitHubAuthoredCommitProvider();

const gitHubApiService: GitHubApiService = GitHubApiServiceFactory.create();

const SONARQUBE: RepositoryRef = new RepositoryRef("SonarSource", "sonarqube");

const commit = (overrides: Partial<GitHubCommit> = {}): GitHubCommit => ({
    sha: "e6516103e4025854cc33236612e86317048f699e",
    html_url: "https://github.com/SonarSource/sonarqube/commit/e6516103",
    commit: {
        message: "SONAR-15574 Add package info file",
        author: { date: "2021-10-28T15:38:53Z" },
    },
    ...overrides,
});

const answers = (...pages: GitHubCommit[][]): MockInstance<typeof gitHubApiService.get> => {
    const get: MockInstance<typeof gitHubApiService.get> = vi.spyOn(gitHubApiService, "get");

    for (const page of pages) {
        get.mockResolvedValueOnce(page);
    }

    return get;
};

const page = (length: number): GitHubCommit[] =>
    Array.from({ length }, (_: unknown, index: number) => commit({ sha: `sha-${index}` }));

afterEach(() => {
    vi.restoreAllMocks();
});

describe("GitHubAuthoredCommitProvider.provide", () => {
    it("givenAGitHubPayload_whenFetchingCommits_thenItIsMappedOntoTheDomainModel", async () => {
        answers([commit()]);

        const commits: AuthoredCommit[] = await underTest.provide(SONARQUBE, "octocat");

        expect(commits).toEqual([
            {
                sha: "e6516103e4025854cc33236612e86317048f699e",
                url: "https://github.com/SonarSource/sonarqube/commit/e6516103",
                message: "SONAR-15574 Add package info file",
                date: "2021-10-28T15:38:53Z",
            },
        ]);
    });

    it("givenAnAuthor_whenFetchingCommits_thenGitHubItselfHoldsTheOthersBack", async () => {
        const get: MockInstance<typeof gitHubApiService.get> = answers([]);

        await underTest.provide(SONARQUBE, "octocat");

        expect(get).toHaveBeenCalledExactlyOnceWith(
            "repos/SonarSource/sonarqube/commits?author=octocat&per_page=100&page=1"
        );
    });

    it("givenAFullPageFollowedByAPartialOne_whenFetchingCommits_thenBothAreCollected", async () => {
        const get: MockInstance<typeof gitHubApiService.get> = answers(page(100), [commit({ sha: "last" })]);

        const commits: AuthoredCommit[] = await underTest.provide(SONARQUBE, "octocat");

        expect(commits).toHaveLength(101);
        expect(get).toHaveBeenCalledTimes(2);
        expect(get).toHaveBeenLastCalledWith("repos/SonarSource/sonarqube/commits?author=octocat&per_page=100&page=2");
    });

    it("givenMorePagesThanTheLimit_whenFetchingCommits_thenItStopsAndSaysSo", async () => {
        const get: MockInstance<typeof gitHubApiService.get> = vi
            .spyOn(gitHubApiService, "get")
            .mockResolvedValue(page(100));
        const warn: MockInstance<typeof console.warn> = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        const commits: AuthoredCommit[] = await underTest.provide(SONARQUBE, "octocat");

        expect(get).toHaveBeenCalledTimes(10);
        expect(commits).toHaveLength(1000);
        expect(warn).toHaveBeenCalledOnce();
    });

    it("givenACommitWithNoAuthor_whenFetchingCommits_thenItCarriesNoDate", async () => {
        answers([commit({ commit: { message: "Fix it", author: null } })]);

        const [mapped]: AuthoredCommit[] = await underTest.provide(SONARQUBE, "octocat");

        expect(mapped.date).toBe("");
    });

    it("givenAnUnreachableSource_whenFetchingCommits_thenTheBuildStops", async () => {
        vi.spyOn(gitHubApiService, "get").mockResolvedValue(null);

        await expect(underTest.provide(SONARQUBE, "octocat")).rejects.toThrow(
            "GitHub API error: the commits of @octocat in SonarSource/sonarqube are unreachable"
        );
    });
});
