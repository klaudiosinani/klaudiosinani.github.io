import { describe, expect, it, vi } from "vitest";
import type { AuthoredCommit } from "@app/infrastructure/github/domain/AuthoredCommit";
import type { AuthoredCommitProvider } from "@app/infrastructure/github/service/AuthoredCommitProvider";
import type { ContributedRepository } from "@app/configuration/ContributedRepository";
import type { Contribution } from "@app/feature/contribution/Contribution";
import { ContributionRetrievalService } from "@app/feature/contribution/service/ContributionRetrievalService";
import { GITHUB_USERNAME } from "@app/configuration/GitHubUsername";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";

const REPOSITORY: ContributedRepository = {
    owner: "SonarSource",
    name: "sonarqube",
    title: "SonarQube",
    url: "https://github.com/SonarSource/sonarqube",
    summary: "SonarQube examines code.",
    role: "I was a senior software engineer there.",
};

const COMMITS: AuthoredCommit[] = [
    {
        sha: "e6516103e4025854cc33236612e86317048f699e",
        url: "https://github.com/SonarSource/sonarqube/commit/e6516103",
        message: "SONAR-15574 Add package info file",
        date: "2021-10-28T15:38:53Z",
    },
];

const provider = (commits: AuthoredCommit[] = COMMITS): AuthoredCommitProvider => ({
    provide: vi.fn().mockResolvedValue(commits),
});

describe("ContributionRetrievalService.retrieve", () => {
    it("givenARepository_whenRetrieving_thenTheCommitsAreAskedForByOwnerAndName", () => {
        const source: AuthoredCommitProvider = provider();
        const underTest: ContributionRetrievalService = new ContributionRetrievalService(REPOSITORY, "octocat", source);

        underTest.retrieve();

        expect(source.provide).toHaveBeenCalledExactlyOnceWith(
            new RepositoryRef("SonarSource", "sonarqube"),
            "octocat"
        );
    });

    it("givenNoAuthor_whenRetrieving_thenTheAccountOfTheSiteIsAskedFor", () => {
        const source: AuthoredCommitProvider = provider();
        const underTest: ContributionRetrievalService = new ContributionRetrievalService(REPOSITORY, undefined, source);

        underTest.retrieve();

        expect(source.provide).toHaveBeenCalledExactlyOnceWith(expect.any(RepositoryRef), GITHUB_USERNAME);
    });

    it("givenCommits_whenRetrieving_thenTheyArriveReadyToDraw", async () => {
        const underTest: ContributionRetrievalService = new ContributionRetrievalService(
            REPOSITORY,
            "octocat",
            provider()
        );

        const contributions: Contribution[] = await underTest.retrieve();

        expect(contributions).toEqual([
            {
                sha: "e6516103e4025854cc33236612e86317048f699e",
                shortSha: "e651610",
                url: "https://github.com/SonarSource/sonarqube/commit/e6516103",
                date: "2021-10-28T15:38:53Z",
                ticket: "SONAR-15574",
                subject: "Add package info file",
            },
        ]);
    });

    it("givenNoProvider_whenRetrieving_thenTheOneOfTheBuildIsUsed", async () => {
        const underTest: ContributionRetrievalService = new ContributionRetrievalService(REPOSITORY);

        const contributions: Contribution[] = await underTest.retrieve();

        expect(contributions.length).toBeGreaterThan(0);
    });
});
