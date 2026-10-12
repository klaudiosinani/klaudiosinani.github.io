import { RepositoryConfiguration } from "@app/feature/repository/profile/RepositoryConfiguration.ts";
import { BuildClock } from "@app/util/datetime/BuildClock.ts";
import type { SystemClock } from "@app/util/datetime/SystemClock.ts";
import { CONTRIBUTED_REPOSITORIES } from "@app/configuration/repository/ContributedRepositories.ts";
import { ContributedWorkService } from "@app/feature/contribution/ContributedWorkService.ts";
import type { ContributionFactory } from "@app/feature/contribution/work/ContributionFactory.ts";
import type { ContributionSummaryFactory } from "@app/feature/contribution/work/ContributionSummaryFactory.ts";
import type { GithubCommitApiService } from "@app/infrastructure/api/github/commit/GithubCommitApiService.ts";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory.ts";
import { ActivityDataRetrievalService } from "@app/feature/activity/ActivityDataRetrievalService.ts";
import { ActivityDatasetRetrievalService } from "@app/feature/impact/ActivityDatasetRetrievalService.ts";
import { GITHUB_USERNAME } from "@app/configuration/author/GitHubUsername.ts";
import { GithubPagination } from "@app/infrastructure/api/github/common/GithubPagination.ts";
import { GithubRepositoryDataRetrievalService } from "@app/infrastructure/api/github/repository/data/GithubRepositoryDataRetrievalService.ts";
import { PaginationService } from "@app/feature/pagination/PaginationService.ts";
import { PressIconResolver } from "@app/feature/press/mark/PressIconResolver.ts";
import { PublicAssetResolver } from "@app/infrastructure/file/asset/PublicAssetResolver.ts";
import { RepositoryProfileRetrievalService } from "@app/feature/repository/profile/RepositoryProfileRetrievalService.ts";
import type { GitHubActivityDataProvider } from "@app/feature/activity/data/GitHubActivityDataProvider.ts";
import type { GithubRepositoryApiService } from "@app/infrastructure/api/github/repository/GithubRepositoryApiService.ts";
import type { ImpactDataProvider } from "@app/feature/impact/metric/ImpactDataProvider.ts";
import type { PaginationConfiguration } from "@app/feature/pagination/PaginationConfiguration.ts";
import type { RepositoryProfileProvider } from "@app/feature/repository/profile/RepositoryProfileProvider.ts";

export class ApplicationConfiguration {
    private readonly PRESS_ICON_DIRECTORY: string = "public/press/icons";
    private readonly PUBLIC_DIRECTORY: string = "public";
    private readonly ENTRIES_PER_PAGE: number = 100;
    private readonly FIRST_PAGE: number = 1;
    private readonly LAST_PAGE: number = 10;

    public activityDataRetrievalService(
        gitHubActivityDataProvider: GitHubActivityDataProvider
    ): ActivityDataRetrievalService {
        return new ActivityDataRetrievalService(GITHUB_USERNAME, gitHubActivityDataProvider);
    }

    public activityDatasetRetrievalService(impactDataProvider: ImpactDataProvider): ActivityDatasetRetrievalService {
        return new ActivityDatasetRetrievalService(GITHUB_USERNAME, impactDataProvider);
    }

    public repositoryProfileRetrievalService(
        repositoryProfileProvider: RepositoryProfileProvider
    ): RepositoryProfileRetrievalService {
        return new RepositoryProfileRetrievalService(GITHUB_USERNAME, repositoryProfileProvider);
    }

    public githubRepositoryDataRetrievalService(
        githubRepositoryApiService: GithubRepositoryApiService
    ): GithubRepositoryDataRetrievalService {
        return new GithubRepositoryDataRetrievalService(
            githubRepositoryApiService,
            new GithubPagination(this.ENTRIES_PER_PAGE, this.FIRST_PAGE, this.LAST_PAGE),
            GITHUB_USERNAME
        );
    }

    public paginationService(paginationConfiguration: PaginationConfiguration): PaginationService {
        return new PaginationService(paginationConfiguration.ITEMS_PER_PAGE);
    }

    public pressIconResolver(): PressIconResolver {
        return new PressIconResolver(this.PRESS_ICON_DIRECTORY);
    }

    public publicAssetResolver(): PublicAssetResolver {
        return new PublicAssetResolver(this.PUBLIC_DIRECTORY);
    }

    public contributedWorkService(
        contributionSummaryFactory: ContributionSummaryFactory,
        githubCommitApiService: GithubCommitApiService,
        contributionFactory: ContributionFactory,
        optionalReaderFactory: OptionalReaderFactory
    ): ContributedWorkService {
        return new ContributedWorkService(
            CONTRIBUTED_REPOSITORIES,
            contributionSummaryFactory,
            githubCommitApiService,
            contributionFactory,
            optionalReaderFactory.create("GitHub")
        );
    }

    public buildClock(systemClock: SystemClock): BuildClock {
        return new BuildClock(systemClock.now());
    }

    public repositoryConfiguration(): RepositoryConfiguration {
        return new RepositoryConfiguration();
    }
}
