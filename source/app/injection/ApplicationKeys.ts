import { InjectionKey } from "@app/injection/InjectionKey.ts";
import type { ActivityDataRetrievalService } from "@app/feature/activity/ActivityDataRetrievalService.ts";
import type { ActivityDatasetRetrievalService } from "@app/feature/impact/ActivityDatasetRetrievalService.ts";
import type { BuildClock } from "@app/util/datetime/BuildClock.ts";
import type { ContributedWork } from "@app/feature/contribution/work/ContributedWork.ts";
import type { ContributedWorkService } from "@app/feature/contribution/ContributedWorkService.ts";
import type { ContributionSource } from "@app/feature/impact/github/ContributionSource.ts";
import type { DependentsSource } from "@app/feature/repository/signal/DependentsSource.ts";
import type { FeaturedPress } from "@app/feature/press/coverage/FeaturedPress.ts";
import type { FeaturedSoftware } from "@app/feature/software/featured/FeaturedSoftware.ts";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData.ts";
import type { GithubRepositoryDataRetrievalService } from "@app/infrastructure/api/github/repository/data/GithubRepositoryDataRetrievalService.ts";
import type { HttpRequestExecutor } from "@app/infrastructure/http/client/HttpRequestExecutor.ts";
import type { ImpactDataProvider } from "@app/feature/impact/metric/ImpactDataProvider.ts";
import type { IssueSearchSource } from "@app/feature/impact/github/IssueSearchSource.ts";
import type { OutletDownloadsSource } from "@app/feature/impact/outlet/OutletDownloadsSource.ts";
import type { PackageListingSource } from "@app/feature/repository/package/PackageListingSource.ts";
import type { PackageRegistryProbe } from "@app/feature/repository/package/PackageRegistryProbe.ts";
import type { PaginationService } from "@app/feature/pagination/PaginationService.ts";
import type { PressIconResolver } from "@app/feature/press/mark/PressIconResolver.ts";
import type { PublicAssetResolver } from "@app/infrastructure/file/asset/PublicAssetResolver.ts";
import type { ReleaseCountSource } from "@app/feature/impact/github/ReleaseCountSource.ts";
import type { ReleaseTotalsSource } from "@app/feature/impact/github/ReleaseTotalsSource.ts";
import type { RepositoryCommitSource } from "@app/feature/repository/commit/RepositoryCommitSource.ts";
import type { RepositoryConfiguration } from "@app/feature/repository/profile/RepositoryConfiguration.ts";
import type { RepositoryDetailSource } from "@app/feature/repository/profile/RepositoryDetailSource.ts";
import type { RepositoryDocumentTextProvider } from "@app/feature/repository/document/RepositoryDocumentTextProvider.ts";
import type { RepositoryDocumentsSource } from "@app/feature/repository/document/RepositoryDocumentsSource.ts";
import type { RepositoryDownloadsSource } from "@app/feature/repository/download/RepositoryDownloadsSource.ts";
import type { RepositoryProfileProvider } from "@app/feature/repository/profile/RepositoryProfileProvider.ts";
import type { RepositoryProfileRetrievalService } from "@app/feature/repository/profile/RepositoryProfileRetrievalService.ts";
import type { RepositoryReadmeSource } from "@app/feature/repository/document/RepositoryReadmeSource.ts";
import type { RepositoryReleaseSource } from "@app/feature/repository/release/RepositoryReleaseSource.ts";
import type { RepositoryTotalsSource } from "@app/feature/repository/signal/RepositoryTotalsSource.ts";
import type { RepositoryTrafficSource } from "@app/feature/repository/signal/RepositoryTrafficSource.ts";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService.ts";
import type { Software } from "@app/feature/software/Software.ts";
import type { SoftwareSignalsSource } from "@app/feature/software/signal/SoftwareSignalsSource.ts";
import type { TrafficSource } from "@app/feature/impact/github/TrafficSource.ts";

export const ACTIVITY_DATASET_RETRIEVAL_SERVICE: InjectionKey<ActivityDatasetRetrievalService> =
    new InjectionKey<ActivityDatasetRetrievalService>("ACTIVITY_DATASET_RETRIEVAL_SERVICE");
export const ACTIVITY_DATA_RETRIEVAL_SERVICE: InjectionKey<ActivityDataRetrievalService> =
    new InjectionKey<ActivityDataRetrievalService>("ACTIVITY_DATA_RETRIEVAL_SERVICE");
export const BUILD_CLOCK: InjectionKey<BuildClock> = new InjectionKey<BuildClock>("BUILD_CLOCK");
export const CONTRIBUTED_WORK_SERVICE: InjectionKey<ContributedWorkService> = new InjectionKey<ContributedWorkService>(
    "CONTRIBUTED_WORK_SERVICE"
);
export const CONTRIBUTION_SOURCE: InjectionKey<ContributionSource> = new InjectionKey<ContributionSource>(
    "CONTRIBUTION_SOURCE"
);
export const DEPENDENTS_SOURCE: InjectionKey<DependentsSource> = new InjectionKey<DependentsSource>(
    "DEPENDENTS_SOURCE"
);
export const GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE: InjectionKey<GithubRepositoryDataRetrievalService> =
    new InjectionKey<GithubRepositoryDataRetrievalService>("GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE");
export const HTTP_REQUEST_EXECUTOR: InjectionKey<HttpRequestExecutor> = new InjectionKey<HttpRequestExecutor>(
    "HTTP_REQUEST_EXECUTOR"
);
export const IMPACT_DATA_PROVIDER: InjectionKey<ImpactDataProvider> = new InjectionKey<ImpactDataProvider>(
    "IMPACT_DATA_PROVIDER"
);
export const ISSUE_SEARCH_SOURCE: InjectionKey<IssueSearchSource> = new InjectionKey<IssueSearchSource>(
    "ISSUE_SEARCH_SOURCE"
);
export const OUTLET_DOWNLOADS_SOURCE: InjectionKey<readonly OutletDownloadsSource[]> = new InjectionKey<
    readonly OutletDownloadsSource[]
>("OUTLET_DOWNLOADS_SOURCE");
export const PACKAGE_LISTING_SOURCE: InjectionKey<PackageListingSource> = new InjectionKey<PackageListingSource>(
    "PACKAGE_LISTING_SOURCE"
);
export const PACKAGE_REGISTRY_PROBE: InjectionKey<readonly PackageRegistryProbe[]> = new InjectionKey<
    readonly PackageRegistryProbe[]
>("PACKAGE_REGISTRY_PROBE");
export const PAGINATION_SERVICE: InjectionKey<PaginationService> = new InjectionKey<PaginationService>(
    "PAGINATION_SERVICE"
);
export const PRESS_ICON_RESOLVER: InjectionKey<PressIconResolver> = new InjectionKey<PressIconResolver>(
    "PRESS_ICON_RESOLVER"
);
export const PUBLIC_ASSET_RESOLVER: InjectionKey<PublicAssetResolver> = new InjectionKey<PublicAssetResolver>(
    "PUBLIC_ASSET_RESOLVER"
);
export const RELEASE_COUNT_SOURCE: InjectionKey<ReleaseCountSource> = new InjectionKey<ReleaseCountSource>(
    "RELEASE_COUNT_SOURCE"
);
export const RELEASE_TOTALS_SOURCE: InjectionKey<ReleaseTotalsSource> = new InjectionKey<ReleaseTotalsSource>(
    "RELEASE_TOTALS_SOURCE"
);
export const REPOSITORY_COMMIT_SOURCE: InjectionKey<RepositoryCommitSource> = new InjectionKey<RepositoryCommitSource>(
    "REPOSITORY_COMMIT_SOURCE"
);
export const REPOSITORY_CONFIGURATION: InjectionKey<RepositoryConfiguration> =
    new InjectionKey<RepositoryConfiguration>("REPOSITORY_CONFIGURATION");
export const REPOSITORY_DETAIL_SOURCE: InjectionKey<RepositoryDetailSource> = new InjectionKey<RepositoryDetailSource>(
    "REPOSITORY_DETAIL_SOURCE"
);
export const REPOSITORY_DOCUMENTS_SOURCE: InjectionKey<RepositoryDocumentsSource> =
    new InjectionKey<RepositoryDocumentsSource>("REPOSITORY_DOCUMENTS_SOURCE");
export const REPOSITORY_DOCUMENT_TEXT_PROVIDER: InjectionKey<RepositoryDocumentTextProvider> =
    new InjectionKey<RepositoryDocumentTextProvider>("REPOSITORY_DOCUMENT_TEXT_PROVIDER");
export const REPOSITORY_DOWNLOADS_SOURCE: InjectionKey<RepositoryDownloadsSource> =
    new InjectionKey<RepositoryDownloadsSource>("REPOSITORY_DOWNLOADS_SOURCE");
export const REPOSITORY_PROFILE_PROVIDER: InjectionKey<RepositoryProfileProvider> =
    new InjectionKey<RepositoryProfileProvider>("REPOSITORY_PROFILE_PROVIDER");
export const REPOSITORY_PROFILE_RETRIEVAL_SERVICE: InjectionKey<RepositoryProfileRetrievalService> =
    new InjectionKey<RepositoryProfileRetrievalService>("REPOSITORY_PROFILE_RETRIEVAL_SERVICE");
export const REPOSITORY_README_SOURCE: InjectionKey<RepositoryReadmeSource> = new InjectionKey<RepositoryReadmeSource>(
    "REPOSITORY_README_SOURCE"
);
export const REPOSITORY_RELEASE_SOURCE: InjectionKey<RepositoryReleaseSource> =
    new InjectionKey<RepositoryReleaseSource>("REPOSITORY_RELEASE_SOURCE");
export const REPOSITORY_TOTALS_SOURCE: InjectionKey<RepositoryTotalsSource> = new InjectionKey<RepositoryTotalsSource>(
    "REPOSITORY_TOTALS_SOURCE"
);
export const REPOSITORY_TRAFFIC_SOURCE: InjectionKey<RepositoryTrafficSource> =
    new InjectionKey<RepositoryTrafficSource>("REPOSITORY_TRAFFIC_SOURCE");
export const RETRIEVAL_SERVICE_CONTRIBUTED_WORK: InjectionKey<RetrievalService<ContributedWork>> = new InjectionKey<
    RetrievalService<ContributedWork>
>("RETRIEVAL_SERVICE_CONTRIBUTED_WORK");
export const RETRIEVAL_SERVICE_FEATURED_PRESS: InjectionKey<RetrievalService<FeaturedPress>> = new InjectionKey<
    RetrievalService<FeaturedPress>
>("RETRIEVAL_SERVICE_FEATURED_PRESS");
export const RETRIEVAL_SERVICE_FEATURED_SOFTWARE: InjectionKey<RetrievalService<FeaturedSoftware>> = new InjectionKey<
    RetrievalService<FeaturedSoftware>
>("RETRIEVAL_SERVICE_FEATURED_SOFTWARE");
export const RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA: InjectionKey<RetrievalService<GithubRepositoryData>> =
    new InjectionKey<RetrievalService<GithubRepositoryData>>("RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA");
export const RETRIEVAL_SERVICE_SOFTWARE: InjectionKey<RetrievalService<Software>> = new InjectionKey<
    RetrievalService<Software>
>("RETRIEVAL_SERVICE_SOFTWARE");
export const SOFTWARE_SIGNALS_SOURCE: InjectionKey<SoftwareSignalsSource> = new InjectionKey<SoftwareSignalsSource>(
    "SOFTWARE_SIGNALS_SOURCE"
);
export const TRAFFIC_SOURCE: InjectionKey<TrafficSource> = new InjectionKey<TrafficSource>("TRAFFIC_SOURCE");
