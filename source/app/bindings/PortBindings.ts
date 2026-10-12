import type { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import type { InstanceResolver } from "@app/injection/InstanceResolver.ts";
import {
    ACTIVITY_DATASET_RETRIEVAL_SERVICE,
    ACTIVITY_DATA_RETRIEVAL_SERVICE,
    BUILD_CLOCK,
    CONTRIBUTED_WORK_SERVICE,
    CONTRIBUTION_SOURCE,
    DEPENDENTS_SOURCE,
    GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE,
    HTTP_REQUEST_EXECUTOR,
    IMPACT_DATA_PROVIDER,
    ISSUE_SEARCH_SOURCE,
    OUTLET_DOWNLOADS_SOURCE,
    PACKAGE_LISTING_SOURCE,
    PACKAGE_REGISTRY_PROBE,
    PAGINATION_SERVICE,
    PRESS_ICON_RESOLVER,
    PUBLIC_ASSET_RESOLVER,
    RELEASE_COUNT_SOURCE,
    RELEASE_TOTALS_SOURCE,
    REPOSITORY_COMMIT_SOURCE,
    REPOSITORY_CONFIGURATION,
    REPOSITORY_DETAIL_SOURCE,
    REPOSITORY_DOCUMENTS_SOURCE,
    REPOSITORY_DOCUMENT_TEXT_PROVIDER,
    REPOSITORY_DOWNLOADS_SOURCE,
    REPOSITORY_PROFILE_PROVIDER,
    REPOSITORY_PROFILE_RETRIEVAL_SERVICE,
    REPOSITORY_README_SOURCE,
    REPOSITORY_RELEASE_SOURCE,
    REPOSITORY_TOTALS_SOURCE,
    REPOSITORY_TRAFFIC_SOURCE,
    RETRIEVAL_SERVICE_CONTRIBUTED_WORK,
    RETRIEVAL_SERVICE_FEATURED_PRESS,
    RETRIEVAL_SERVICE_FEATURED_SOFTWARE,
    RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA,
    RETRIEVAL_SERVICE_SOFTWARE,
    SOFTWARE_SIGNALS_SOURCE,
    TRAFFIC_SOURCE,
} from "@app/injection/ApplicationKeys.ts";
import { ApplicationConfiguration } from "@app/configuration/ApplicationConfiguration.ts";
import { CachingHttpClient } from "@app/infrastructure/http/client/CachingHttpClient.ts";
import { ContributionFactory } from "@app/feature/contribution/work/ContributionFactory.ts";
import { ContributionSummaryFactory } from "@app/feature/contribution/work/ContributionSummaryFactory.ts";
import { DependentsProvider } from "@app/feature/repository/signal/DependentsProvider.ts";
import { FeaturedPressRetrievalService } from "@app/feature/press/FeaturedPressRetrievalService.ts";
import { FeaturedSoftwareRetrievalService } from "@app/feature/software/featured/FeaturedSoftwareRetrievalService.ts";
import { GitHubActivityDataProvider } from "@app/feature/activity/data/GitHubActivityDataProvider.ts";
import { GitHubContributionsProvider } from "@app/feature/impact/github/GitHubContributionsProvider.ts";
import { GitHubReleasesProvider } from "@app/feature/impact/github/GitHubReleasesProvider.ts";
import { GitHubSearchProvider } from "@app/feature/impact/github/GitHubSearchProvider.ts";
import { GitHubTrafficProvider } from "@app/feature/impact/github/GitHubTrafficProvider.ts";
import { GithubCommitApiService } from "@app/infrastructure/api/github/commit/GithubCommitApiService.ts";
import { GithubRepositoryApiService } from "@app/infrastructure/api/github/repository/GithubRepositoryApiService.ts";
import { GithubRepositoryCommitService } from "@app/feature/repository/commit/GithubRepositoryCommitService.ts";
import { GithubRepositoryDetailService } from "@app/feature/repository/profile/GithubRepositoryDetailService.ts";
import { GithubRepositoryDocumentTextService } from "@app/feature/repository/document/GithubRepositoryDocumentTextService.ts";
import { GithubRepositoryDocumentsService } from "@app/feature/repository/document/GithubRepositoryDocumentsService.ts";
import { GithubRepositoryReadmeService } from "@app/feature/repository/document/GithubRepositoryReadmeService.ts";
import { GithubRepositoryReleaseService } from "@app/feature/repository/release/GithubRepositoryReleaseService.ts";
import { GithubRepositoryTrafficService } from "@app/feature/repository/signal/GithubRepositoryTrafficService.ts";
import { HomebrewInstallsProvider } from "@app/feature/impact/outlet/HomebrewInstallsProvider.ts";
import { HttpClient } from "@app/infrastructure/http/client/HttpClient.ts";
import { LiveImpactDataProvider } from "@app/feature/impact/metric/LiveImpactDataProvider.ts";
import { LiveRepositoryProfileProvider } from "@app/feature/repository/profile/LiveRepositoryProfileProvider.ts";
import { NpmPackageRegistryProbe } from "@app/feature/repository/package/NpmPackageRegistryProbe.ts";
import { PackageListingProvider } from "@app/feature/repository/package/PackageListingProvider.ts";
import { PaginationConfiguration } from "@app/feature/pagination/PaginationConfiguration.ts";
import { PypiOutletProvider } from "@app/feature/impact/outlet/PypiOutletProvider.ts";
import { PypiPackageRegistryProbe } from "@app/feature/repository/package/PypiPackageRegistryProbe.ts";
import { ReleaseCountCalculator } from "@app/feature/impact/aggregation/ReleaseCountCalculator.ts";
import { RepositoryDownloadsProvider } from "@app/feature/repository/download/RepositoryDownloadsProvider.ts";
import { RepositorySignalsSource } from "@app/feature/repository/signal/RepositorySignalsSource.ts";
import { RepositoryTotalsRetrievalService } from "@app/feature/repository/signal/RepositoryTotalsRetrievalService.ts";
import { SnapcraftPackageRegistryProbe } from "@app/feature/repository/package/SnapcraftPackageRegistryProbe.ts";
import { SoftwareRetrievalService } from "@app/feature/software/SoftwareRetrievalService.ts";
import { SystemClock } from "@app/util/datetime/SystemClock.ts";

export const bindPort = (registry: InstanceFactoryRegistry, resolver: InstanceResolver, isCaching: boolean): void => {
    registry.bind(ACTIVITY_DATASET_RETRIEVAL_SERVICE, () =>
        resolver
            .resolve(ApplicationConfiguration)
            .activityDatasetRetrievalService(resolver.resolve(LiveImpactDataProvider))
    );
    registry.bind(ACTIVITY_DATA_RETRIEVAL_SERVICE, () =>
        resolver
            .resolve(ApplicationConfiguration)
            .activityDataRetrievalService(resolver.resolve(GitHubActivityDataProvider))
    );
    registry.bind(BUILD_CLOCK, () =>
        resolver.resolve(ApplicationConfiguration).buildClock(resolver.resolve(SystemClock))
    );
    registry.bind(CONTRIBUTED_WORK_SERVICE, () =>
        resolver
            .resolve(ApplicationConfiguration)
            .contributedWorkService(
                resolver.resolve(ContributionSummaryFactory),
                resolver.resolve(GithubCommitApiService),
                resolver.resolve(ContributionFactory)
            )
    );
    registry.bind(CONTRIBUTION_SOURCE, () => resolver.resolve(GitHubContributionsProvider));
    registry.bind(DEPENDENTS_SOURCE, () => resolver.resolve(DependentsProvider));
    registry.bind(GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE, () =>
        resolver
            .resolve(ApplicationConfiguration)
            .githubRepositoryDataRetrievalService(resolver.resolve(GithubRepositoryApiService))
    );
    registry.bind(HTTP_REQUEST_EXECUTOR, () =>
        isCaching ? resolver.resolve(CachingHttpClient) : resolver.resolve(HttpClient)
    );
    registry.bind(IMPACT_DATA_PROVIDER, () => resolver.resolve(LiveImpactDataProvider));
    registry.bind(ISSUE_SEARCH_SOURCE, () => resolver.resolve(GitHubSearchProvider));
    registry.bind(OUTLET_DOWNLOADS_SOURCE, () => [
        resolver.resolve(HomebrewInstallsProvider),
        resolver.resolve(PypiOutletProvider),
    ]);
    registry.bind(PACKAGE_LISTING_SOURCE, () => resolver.resolve(PackageListingProvider));
    registry.bind(PACKAGE_REGISTRY_PROBE, () => [
        resolver.resolve(NpmPackageRegistryProbe),
        resolver.resolve(PypiPackageRegistryProbe),
        resolver.resolve(SnapcraftPackageRegistryProbe),
    ]);
    registry.bind(PAGINATION_SERVICE, () =>
        resolver.resolve(ApplicationConfiguration).paginationService(resolver.resolve(PaginationConfiguration))
    );
    registry.bind(PRESS_ICON_RESOLVER, () => resolver.resolve(ApplicationConfiguration).pressIconResolver());
    registry.bind(PUBLIC_ASSET_RESOLVER, () => resolver.resolve(ApplicationConfiguration).publicAssetResolver());
    registry.bind(RELEASE_COUNT_SOURCE, () => resolver.resolve(ReleaseCountCalculator));
    registry.bind(RELEASE_TOTALS_SOURCE, () => resolver.resolve(GitHubReleasesProvider));
    registry.bind(REPOSITORY_COMMIT_SOURCE, () => resolver.resolve(GithubRepositoryCommitService));
    registry.bind(REPOSITORY_CONFIGURATION, () => resolver.resolve(ApplicationConfiguration).repositoryConfiguration());
    registry.bind(REPOSITORY_DETAIL_SOURCE, () => resolver.resolve(GithubRepositoryDetailService));
    registry.bind(REPOSITORY_DOCUMENTS_SOURCE, () => resolver.resolve(GithubRepositoryDocumentsService));
    registry.bind(REPOSITORY_DOCUMENT_TEXT_PROVIDER, () => resolver.resolve(GithubRepositoryDocumentTextService));
    registry.bind(REPOSITORY_DOWNLOADS_SOURCE, () => resolver.resolve(RepositoryDownloadsProvider));
    registry.bind(REPOSITORY_PROFILE_PROVIDER, () => resolver.resolve(LiveRepositoryProfileProvider));
    registry.bind(REPOSITORY_PROFILE_RETRIEVAL_SERVICE, () =>
        resolver
            .resolve(ApplicationConfiguration)
            .repositoryProfileRetrievalService(resolver.resolve(LiveRepositoryProfileProvider))
    );
    registry.bind(REPOSITORY_README_SOURCE, () => resolver.resolve(GithubRepositoryReadmeService));
    registry.bind(REPOSITORY_RELEASE_SOURCE, () => resolver.resolve(GithubRepositoryReleaseService));
    registry.bind(REPOSITORY_TOTALS_SOURCE, () => resolver.resolve(RepositoryTotalsRetrievalService));
    registry.bind(REPOSITORY_TRAFFIC_SOURCE, () => resolver.resolve(GithubRepositoryTrafficService));
    registry.bind(RETRIEVAL_SERVICE_CONTRIBUTED_WORK, () =>
        resolver
            .resolve(ApplicationConfiguration)
            .contributedWorkService(
                resolver.resolve(ContributionSummaryFactory),
                resolver.resolve(GithubCommitApiService),
                resolver.resolve(ContributionFactory)
            )
    );
    registry.bind(RETRIEVAL_SERVICE_FEATURED_PRESS, () => resolver.resolve(FeaturedPressRetrievalService));
    registry.bind(RETRIEVAL_SERVICE_FEATURED_SOFTWARE, () => resolver.resolve(FeaturedSoftwareRetrievalService));
    registry.bind(RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA, () =>
        resolver
            .resolve(ApplicationConfiguration)
            .githubRepositoryDataRetrievalService(resolver.resolve(GithubRepositoryApiService))
    );
    registry.bind(RETRIEVAL_SERVICE_SOFTWARE, () => resolver.resolve(SoftwareRetrievalService));
    registry.bind(SOFTWARE_SIGNALS_SOURCE, () => resolver.resolve(RepositorySignalsSource));
    registry.bind(TRAFFIC_SOURCE, () => resolver.resolve(GitHubTrafficProvider));
};
