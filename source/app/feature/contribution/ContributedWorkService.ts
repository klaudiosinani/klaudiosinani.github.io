import type { ContributionFactory } from "@app/feature/contribution/work/ContributionFactory";
import type { GithubCommitApiService } from "@app/infrastructure/api/github/commit/GithubCommitApiService";
import { GITHUB_USERNAME } from "@app/configuration/author/GitHubUsername";
import type { ContributionSummaryFactory } from "@app/feature/contribution/work/ContributionSummaryFactory";
import type { ContributedRepository } from "@app/configuration/repository/ContributedRepository";
import { ContributedWork } from "./work/ContributedWork";
import type { Contribution } from "./work/Contribution";
import { ContributionRetrievalService } from "./work/ContributionRetrievalService";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";

export class ContributedWorkService implements RetrievalService<ContributedWork> {
    private readonly repositories: readonly ContributedRepository[];
    private readonly contributionSummaryFactory: ContributionSummaryFactory;
    private readonly githubCommitApiService: GithubCommitApiService;
    private readonly contributionFactory: ContributionFactory;
    private readonly optionalReader: OptionalReader;

    public constructor(
        repositories: readonly ContributedRepository[],
        contributionSummaryFactory: ContributionSummaryFactory,
        githubCommitApiService: GithubCommitApiService,
        contributionFactory: ContributionFactory,
        optionalReader: OptionalReader
    ) {
        this.repositories = repositories;
        this.contributionSummaryFactory = contributionSummaryFactory;
        this.githubCommitApiService = githubCommitApiService;
        this.contributionFactory = contributionFactory;
        this.optionalReader = optionalReader;
    }

    public async retrieve(): Promise<ContributedWork[]> {
        return Promise.all(
            this.repositories.map(async (repository: ContributedRepository) => {
                const contributions: Contribution[] =
                    (await this.optionalReader.read<Contribution[]>(
                        `the contributions to ${repository.getOwner()}/${repository.getName()}`,
                        () =>
                            new ContributionRetrievalService(
                                repository,
                                GITHUB_USERNAME,
                                this.githubCommitApiService,
                                this.contributionFactory
                            ).retrieve()
                    )) ?? [];

                return new ContributedWork(
                    repository,
                    contributions,
                    this.contributionSummaryFactory.create(contributions)
                );
            })
        );
    }
}
