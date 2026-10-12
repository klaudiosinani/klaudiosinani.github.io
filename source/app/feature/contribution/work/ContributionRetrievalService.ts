import type { ContributionFactory } from "@app/feature/contribution/work/ContributionFactory";
import type { GithubCommitApiService } from "@app/infrastructure/api/github/commit/GithubCommitApiService";
import { GithubPagination } from "@app/infrastructure/api/github/common/GithubPagination";
import type { GithubAuthoredCommit } from "@app/infrastructure/api/github/commit/GithubAuthoredCommit";
import type { ContributedRepository } from "@app/configuration/repository/ContributedRepository";
import type { Contribution } from "./Contribution";
import { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";

export class ContributionRetrievalService implements RetrievalService<Contribution> {
    private readonly COMMITS_PER_PAGE: number = 100;

    private readonly FIRST_PAGE: number = 1;

    private readonly LAST_PAGE: number = 10;

    private readonly repository: GithubRepositoryRef;
    private readonly author: string;
    private readonly githubCommitApiService: GithubCommitApiService;
    private readonly contributionFactory: ContributionFactory;

    public constructor(
        repository: ContributedRepository,
        author: string,
        githubCommitApiService: GithubCommitApiService,
        contributionFactory: ContributionFactory
    ) {
        this.repository = new GithubRepositoryRef(repository.getOwner(), repository.getName());
        this.author = author;
        this.githubCommitApiService = githubCommitApiService;
        this.contributionFactory = contributionFactory;
    }

    public async retrieve(): Promise<Contribution[]> {
        const pagination: GithubPagination = new GithubPagination(
            this.COMMITS_PER_PAGE,
            this.FIRST_PAGE,
            this.LAST_PAGE
        );

        const commits: GithubAuthoredCommit[] = await this.githubCommitApiService.getAuthoredCommits(
            this.repository,
            this.author,
            pagination
        );

        return this.contributionFactory.create(commits);
    }
}
