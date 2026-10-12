import type { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import type { InstanceResolver } from "@app/injection/InstanceResolver.ts";
import {
    BUILD_CLOCK,
    GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE,
    REPOSITORY_CONFIGURATION,
    REPOSITORY_PROFILE_RETRIEVAL_SERVICE,
    RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA,
} from "@app/injection/ApplicationKeys.ts";
import { ActivityConfiguration } from "@app/feature/activity/ActivityConfiguration.ts";
import { ActivityKindTally } from "@app/feature/activity/timeline/ActivityKindTally.ts";
import { ActivityMonthGrouper } from "@app/feature/activity/timeline/ActivityMonthGrouper.ts";
import { ActivityTimelineResolver } from "@app/feature/activity/timeline/ActivityTimelineResolver.ts";
import { CheckRunDtoAssembler } from "@app/feature/repository/commit/CheckRunDtoAssembler.ts";
import { CheckRunsDtoAssembler } from "@app/feature/repository/commit/CheckRunsDtoAssembler.ts";
import { CodeSegmenter } from "@app/feature/contribution/commit/CodeSegmenter.ts";
import { CommitChecksFormatter } from "@app/feature/repository/commit/CommitChecksFormatter.ts";
import { CommitMessage } from "@app/util/text/CommitMessage.ts";
import { CommitShaFormatter } from "@app/util/text/CommitShaFormatter.ts";
import { CommitSubjectParser } from "@app/feature/contribution/commit/CommitSubjectParser.ts";
import { ContentCollectionService } from "@app/infrastructure/content/ContentCollectionService.ts";
import { ContributionConfiguration } from "@app/feature/contribution/ContributionConfiguration.ts";
import { ContributionFactory } from "@app/feature/contribution/work/ContributionFactory.ts";
import { ContributionSummaryFactory } from "@app/feature/contribution/work/ContributionSummaryFactory.ts";
import { CountedDtoAssembler } from "@app/feature/repository/download/CountedDtoAssembler.ts";
import { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter.ts";
import { DependentsProvider } from "@app/feature/repository/signal/DependentsProvider.ts";
import { DocumentAlternatesFactory } from "@app/feature/repository/document/DocumentAlternatesFactory.ts";
import { DocumentLanguages } from "@app/feature/repository/document/DocumentLanguages.ts";
import { DownloadActivity } from "@app/feature/repository/download/DownloadActivity.ts";
import { DownloadDeltaCalculator } from "@app/feature/impact/change/DownloadDeltaCalculator.ts";
import { EmploymentDurationFormatter } from "@app/feature/experience/EmploymentDurationFormatter.ts";
import { ExperienceStayFactory } from "@app/feature/experience/ExperienceStayFactory.ts";
import { FeaturedPressRetrievalService } from "@app/feature/press/FeaturedPressRetrievalService.ts";
import { OutletFactory } from "@app/feature/press/outlet/OutletFactory.ts";
import { FeaturedSoftwareEntryFactory } from "@app/feature/software/featured/FeaturedSoftwareEntryFactory.ts";
import { FeaturedSoftwareEntryRetrievalService } from "@app/feature/software/featured/FeaturedSoftwareEntryRetrievalService.ts";
import { FeaturedSoftwareResolver } from "@app/feature/software/featured/FeaturedSoftwareResolver.ts";
import { FeaturedSoftwareRetrievalService } from "@app/feature/software/featured/FeaturedSoftwareRetrievalService.ts";
import { GitHubActivityDataProvider } from "@app/feature/activity/data/GitHubActivityDataProvider.ts";
import { GitHubContributionsProvider } from "@app/feature/impact/github/GitHubContributionsProvider.ts";
import { GitHubReleasesProvider } from "@app/feature/impact/github/GitHubReleasesProvider.ts";
import { GitHubSearchProvider } from "@app/feature/impact/github/GitHubSearchProvider.ts";
import { GitHubTrafficProvider } from "@app/feature/impact/github/GitHubTrafficProvider.ts";
import { GithubAccessToken } from "@app/infrastructure/api/github/common/GithubAccessToken.ts";
import { GithubApiService } from "@app/infrastructure/api/github/common/GithubApiService.ts";
import { GithubCommitDtoAssembler } from "@app/infrastructure/api/github/commit/GithubCommitDtoAssembler.ts";
import { GithubCommitEndpointAssembler } from "@app/infrastructure/api/github/commit/GithubCommitEndpointAssembler.ts";
import { GithubContentEndpointAssembler } from "@app/infrastructure/api/github/content/GithubContentEndpointAssembler.ts";
import { GithubDependentsApiService } from "@app/infrastructure/api/github/dependents/GithubDependentsApiService.ts";
import { GithubGraphqlEndpointAssembler } from "@app/infrastructure/api/github/common/GithubGraphqlEndpointAssembler.ts";
import { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader.ts";
import { GithubReleaseDtoAssembler } from "@app/infrastructure/api/github/release/GithubReleaseDtoAssembler.ts";
import { GithubReleaseEndpointAssembler } from "@app/infrastructure/api/github/release/GithubReleaseEndpointAssembler.ts";
import { GithubRepositoryCommitService } from "@app/feature/repository/commit/GithubRepositoryCommitService.ts";
import { GithubRepositoryDetailEndpointAssembler } from "@app/infrastructure/api/github/repository/request/GithubRepositoryDetailEndpointAssembler.ts";
import { GithubRepositoryDetailService } from "@app/feature/repository/profile/GithubRepositoryDetailService.ts";
import { GithubRepositoryDocumentTextService } from "@app/feature/repository/document/GithubRepositoryDocumentTextService.ts";
import { GithubRepositoryDocumentsService } from "@app/feature/repository/document/GithubRepositoryDocumentsService.ts";
import { GithubRepositoryReadmeService } from "@app/feature/repository/document/GithubRepositoryReadmeService.ts";
import { GithubRepositoryReleaseService } from "@app/feature/repository/release/GithubRepositoryReleaseService.ts";
import { GithubRepositoryTotalsService } from "@app/feature/repository/signal/GithubRepositoryTotalsService.ts";
import { GithubRepositoryTrafficService } from "@app/feature/repository/signal/GithubRepositoryTrafficService.ts";
import { GithubSearchEndpointAssembler } from "@app/infrastructure/api/github/search/GithubSearchEndpointAssembler.ts";
import { GithubTrafficEndpointAssembler } from "@app/infrastructure/api/github/traffic/GithubTrafficEndpointAssembler.ts";
import { HomebrewApiService } from "@app/infrastructure/api/homebrew/HomebrewApiService.ts";
import { HomebrewInstallsProvider } from "@app/feature/impact/outlet/HomebrewInstallsProvider.ts";
import { HttpApiService } from "@app/infrastructure/http/HttpApiService.ts";
import { InstallCommandResolver } from "@app/feature/repository/package/InstallCommandResolver.ts";
import { InstallCommandsFactory } from "@app/feature/repository/package/InstallCommandsFactory.ts";
import { LegacyDocumentAddressFactory } from "@app/feature/repository/document/LegacyDocumentAddressFactory.ts";
import { LegacyRedirectPage } from "@app/feature/repository/document/LegacyRedirectPage.ts";
import { LiveImpactDataProvider } from "@app/feature/impact/metric/LiveImpactDataProvider.ts";
import { LiveRepositoryProfileProvider } from "@app/feature/repository/profile/LiveRepositoryProfileProvider.ts";
import { MarkdownRenderer } from "@app/infrastructure/render/markdown/MarkdownRenderer.ts";
import { MetricDeltaCalculator } from "@app/feature/impact/change/MetricDeltaCalculator.ts";
import { MonthGrouper } from "@app/util/period/MonthGrouper.ts";
import { NpmDownloadTotalsRetrievalService } from "@app/feature/repository/download/NpmDownloadTotalsRetrievalService.ts";
import { NpmDownloadTotalsService } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotalsService.ts";
import { NpmPackageDtoAssembler } from "@app/feature/repository/package/NpmPackageDtoAssembler.ts";
import { NpmPackageRegistryProbe } from "@app/feature/repository/package/NpmPackageRegistryProbe.ts";
import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";
import { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory.ts";
import { OutletDownloadsFactory } from "@app/feature/impact/outlet/OutletDownloadsFactory.ts";
import { PackageListingProvider } from "@app/feature/repository/package/PackageListingProvider.ts";
import { PageTitleFormatter } from "@app/util/text/PageTitleFormatter.ts";
import { PaginationConfiguration } from "@app/feature/pagination/PaginationConfiguration.ts";
import { PeriodDeltasCalculator } from "@app/feature/impact/change/PeriodDeltasCalculator.ts";
import { PeriodDownloadsCalculator } from "@app/feature/impact/aggregation/PeriodDownloadsCalculator.ts";
import { PressCoverageFormatter } from "@app/feature/press/coverage/PressCoverageFormatter.ts";
import { PressIssueFormatter } from "@app/feature/press/coverage/PressIssueFormatter.ts";
import { PressProjectResolver } from "@app/feature/press/coverage/PressProjectResolver.ts";
import { ProfileCollectionService } from "@app/feature/repository/profile/ProfileCollectionService.ts";
import { PublicationConfiguration } from "@app/feature/publication/PublicationConfiguration.ts";
import { PublicationNeighbourResolver } from "@app/feature/publication/related/PublicationNeighbourResolver.ts";
import { PublicationQueryService } from "@app/feature/publication/PublicationQueryService.ts";
import { PublishedReleaseResolver } from "@app/feature/repository/release/PublishedReleaseResolver.ts";
import { PublisherIdentity } from "@app/feature/repository/package/PublisherIdentity.ts";
import { PublisherMarksFactory } from "@app/feature/press/mark/PublisherMarksFactory.ts";
import { PypiDownloadApiService } from "@app/infrastructure/api/pypi/download/PypiDownloadApiService.ts";
import { PypiOutletProvider } from "@app/feature/impact/outlet/PypiOutletProvider.ts";
import { PypiPackageDtoAssembler } from "@app/feature/repository/package/PypiPackageDtoAssembler.ts";
import { PypiPackageRegistryProbe } from "@app/feature/repository/package/PypiPackageRegistryProbe.ts";
import { ReadingTimeResolver } from "@app/feature/publication/reading/ReadingTimeResolver.ts";
import { RelatedPublicationResolver } from "@app/feature/publication/related/RelatedPublicationResolver.ts";
import { RelatedRepositoryResolver } from "@app/feature/repository/profile/RelatedRepositoryResolver.ts";
import { ReleaseAddressResolver } from "@app/feature/repository/release/ReleaseAddressResolver.ts";
import { ReleaseCadenceFormatter } from "@app/feature/repository/release/ReleaseCadenceFormatter.ts";
import { ReleaseComparisonResolver } from "@app/feature/repository/release/ReleaseComparisonResolver.ts";
import { ReleaseCountCalculator } from "@app/feature/impact/aggregation/ReleaseCountCalculator.ts";
import { ReleaseHistoryFactory } from "@app/feature/repository/release/ReleaseHistoryFactory.ts";
import { ReleaseInstallCommandResolver } from "@app/feature/repository/release/ReleaseInstallCommandResolver.ts";
import { ReleaseMessaging } from "@app/feature/repository/release/ReleaseMessaging.ts";
import { ReleaseNotesRenderer } from "@app/feature/repository/release/ReleaseNotesRenderer.ts";
import { ReleasePageMetadataFactory } from "@app/feature/repository/release/ReleasePageMetadataFactory.ts";
import { ReleaseSlugFormatter } from "@app/feature/repository/release/ReleaseSlugFormatter.ts";
import { ReleaseSummaryFormatter } from "@app/feature/repository/release/ReleaseSummaryFormatter.ts";
import { ReportingPeriods } from "@app/util/period/ReportingPeriods.ts";
import { ReportingWindowCalculator } from "@app/util/period/ReportingWindowCalculator.ts";
import { RepositoryAddressResolver } from "@app/feature/repository/page/RepositoryAddressResolver.ts";
import { RepositoryCommitDtoAssembler } from "@app/feature/repository/commit/RepositoryCommitDtoAssembler.ts";
import { RepositoryDocumentDescriptionFactory } from "@app/feature/repository/document/RepositoryDocumentDescriptionFactory.ts";
import { RepositoryDocumentKinds } from "@app/feature/repository/document/RepositoryDocumentKinds.ts";
import { RepositoryDocumentRenderer } from "@app/feature/repository/document/RepositoryDocumentRenderer.ts";
import { RepositoryDocumentsFactory } from "@app/feature/repository/document/RepositoryDocumentsFactory.ts";
import { RepositoryDownloadChart } from "@app/feature/repository/download/RepositoryDownloadChart.ts";
import { RepositoryDownloadsCalculator } from "@app/feature/repository/download/RepositoryDownloadsCalculator.ts";
import { RepositoryDownloadsProvider } from "@app/feature/repository/download/RepositoryDownloadsProvider.ts";
import { RepositoryFacts } from "@app/feature/repository/profile/RepositoryFacts.ts";
import { RepositoryFigureClusterFactory } from "@app/feature/repository/page/RepositoryFigureClusterFactory.ts";
import { RepositoryLicenseResolver } from "@app/feature/repository/profile/RepositoryLicenseResolver.ts";
import { RepositoryLinkFactory } from "@app/feature/repository/page/RepositoryLinkFactory.ts";
import { RepositoryManualRenderer } from "@app/feature/repository/document/RepositoryManualRenderer.ts";
import { RepositoryMetadataFactory } from "@app/feature/repository/page/RepositoryMetadataFactory.ts";
import { RepositoryNameResolver } from "@app/util/routing/RepositoryNameResolver.ts";
import { RepositoryOgDetailsResolver } from "@app/feature/repository/page/RepositoryOgDetailsResolver.ts";
import { RepositoryPageMetadataFactory } from "@app/feature/repository/page/RepositoryPageMetadataFactory.ts";
import { RepositoryPageNavigationFactory } from "@app/feature/repository/page/RepositoryPageNavigationFactory.ts";
import { RepositoryProfileResolver } from "@app/feature/repository/profile/RepositoryProfileResolver.ts";
import { RepositorySignalsResolver } from "@app/feature/repository/signal/RepositorySignalsResolver.ts";
import { RepositorySignalsSource } from "@app/feature/repository/signal/RepositorySignalsSource.ts";
import { RepositorySubPageMetadataFactory } from "@app/feature/repository/page/RepositorySubPageMetadataFactory.ts";
import { RepositoryTotalsNodeDtoAssembler } from "@app/feature/repository/signal/RepositoryTotalsNodeDtoAssembler.ts";
import { RepositoryTotalsQuery } from "@app/feature/repository/signal/RepositoryTotalsQuery.ts";
import { RepositoryTotalsRetrievalService } from "@app/feature/repository/signal/RepositoryTotalsRetrievalService.ts";
import { RepositoryTrailFactory } from "@app/feature/repository/page/RepositoryTrailFactory.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { SearchCursor } from "@app/feature/search/query/SearchCursor.ts";
import { SearchDestination } from "@app/feature/search/query/SearchDestination.ts";
import { SearchHighlightFactory } from "@app/feature/search/result/SearchHighlightFactory.ts";
import { SearchIndexFactory } from "@app/feature/search/item/SearchIndexFactory.ts";
import { SearchItemKinds } from "@app/feature/search/item/SearchItemKinds.ts";
import { SearchKindTally } from "@app/feature/search/result/SearchKindTally.ts";
import { SearchQueryUrlResolver } from "@app/feature/search/query/SearchQueryUrlResolver.ts";
import { SearchQueryValidator } from "@app/feature/search/query/SearchQueryValidator.ts";
import { SearchSubjectsFactory } from "@app/feature/search/item/SearchSubjectsFactory.ts";
import { ShareLinksFactory } from "@app/feature/publication/share/ShareLinksFactory.ts";
import { SignaleLoggerFactory } from "@app/infrastructure/log/SignaleLoggerFactory.ts";
import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import { SnapChannelVersionDtoAssembler } from "@app/feature/repository/package/SnapChannelVersionDtoAssembler.ts";
import { SnapPackageDtoAssembler } from "@app/feature/repository/package/SnapPackageDtoAssembler.ts";
import { SnapcraftInstallsRetrievalService } from "@app/feature/repository/download/SnapcraftInstallsRetrievalService.ts";
import { SnapcraftMetricsApiService } from "@app/infrastructure/api/snapcraft/metrics/SnapcraftMetricsApiService.ts";
import { SnapcraftPackageRegistryProbe } from "@app/feature/repository/package/SnapcraftPackageRegistryProbe.ts";
import { SnapcraftSnapApiService } from "@app/infrastructure/api/snapcraft/snap/SnapcraftSnapApiService.ts";
import { SnapshotMetricsCalculator } from "@app/feature/impact/aggregation/SnapshotMetricsCalculator.ts";
import { SoftwareConfiguration } from "@app/feature/software/SoftwareConfiguration.ts";
import { SoftwareFactory } from "@app/feature/software/SoftwareFactory.ts";
import { SoftwareRetrievalService } from "@app/feature/software/SoftwareRetrievalService.ts";
import { SoftwareSignalsFactory } from "@app/feature/software/signal/SoftwareSignalsFactory.ts";
import { StatedRelatedProjectsResolver } from "@app/feature/repository/profile/StatedRelatedProjectsResolver.ts";
import { TagPageMetadataResolver } from "@app/feature/publication/tag/TagPageMetadataResolver.ts";
import { TitleFormatter } from "@app/util/text/TitleFormatter.ts";
import { WordCounter } from "@app/util/text/WordCounter.ts";

export const bindFeature = (registry: InstanceFactoryRegistry, resolver: InstanceResolver): void => {
    registry.bind(ActivityConfiguration, () => new ActivityConfiguration());
    registry.bind(ActivityKindTally, () => new ActivityKindTally());
    registry.bind(ActivityMonthGrouper, () => new ActivityMonthGrouper(resolver.resolve(MonthGrouper)));
    registry.bind(ActivityTimelineResolver, () => new ActivityTimelineResolver(resolver.resolve(CommitShaFormatter)));
    registry.bind(CheckRunDtoAssembler, () => new CheckRunDtoAssembler());
    registry.bind(CheckRunsDtoAssembler, () => new CheckRunsDtoAssembler(resolver.resolve(CheckRunDtoAssembler)));
    registry.bind(CodeSegmenter, () => new CodeSegmenter());
    registry.bind(CommitChecksFormatter, () => new CommitChecksFormatter());
    registry.bind(CommitSubjectParser, () => new CommitSubjectParser(resolver.resolve(CommitMessage)));
    registry.bind(ContributionConfiguration, () => new ContributionConfiguration());
    registry.bind(
        ContributionFactory,
        () => new ContributionFactory(resolver.resolve(CommitShaFormatter), resolver.resolve(CommitSubjectParser))
    );
    registry.bind(ContributionSummaryFactory, () => new ContributionSummaryFactory());
    registry.bind(CountedDtoAssembler, () => new CountedDtoAssembler());
    registry.bind(
        DependentsProvider,
        () =>
            new DependentsProvider(
                resolver.resolve(GithubDependentsApiService),
                resolver.resolve(OptionalReaderFactory)
            )
    );
    registry.bind(
        DocumentAlternatesFactory,
        () =>
            new DocumentAlternatesFactory(
                resolver.resolve(DocumentLanguages),
                resolver.resolve(RepositoryDocumentKinds),
                resolver.resolve(RoutePathResolver)
            )
    );
    registry.bind(DocumentLanguages, () => new DocumentLanguages());
    registry.bind(DownloadActivity, () => new DownloadActivity());
    registry.bind(
        DownloadDeltaCalculator,
        () => new DownloadDeltaCalculator(resolver.resolve(MetricDeltaCalculator), resolver.resolve(ReportingPeriods))
    );
    registry.bind(EmploymentDurationFormatter, () => new EmploymentDurationFormatter());
    registry.bind(
        ExperienceStayFactory,
        () => new ExperienceStayFactory(resolver.resolve(EmploymentDurationFormatter))
    );
    registry.bind(
        FeaturedPressRetrievalService,
        () => new FeaturedPressRetrievalService(resolver.resolve(ContentCollectionService))
    );
    registry.bind(OutletFactory, () => new OutletFactory());
    registry.bind(FeaturedSoftwareEntryFactory, () => new FeaturedSoftwareEntryFactory());
    registry.bind(
        FeaturedSoftwareEntryRetrievalService,
        () =>
            new FeaturedSoftwareEntryRetrievalService(
                resolver.resolve(RepositorySignalsSource),
                resolver.resolve(FeaturedSoftwareRetrievalService),
                resolver.resolve(RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA),
                resolver.resolve(FeaturedSoftwareResolver)
            )
    );
    registry.bind(
        FeaturedSoftwareResolver,
        () =>
            new FeaturedSoftwareResolver(
                resolver.resolve(RepositoryNameResolver),
                resolver.resolve(TitleFormatter),
                resolver.resolve(FeaturedSoftwareEntryFactory),
                resolver.resolve(SoftwareSignalsFactory)
            )
    );
    registry.bind(
        FeaturedSoftwareRetrievalService,
        () => new FeaturedSoftwareRetrievalService(resolver.resolve(ContentCollectionService))
    );
    registry.bind(
        GitHubActivityDataProvider,
        () =>
            new GitHubActivityDataProvider(
                resolver.resolve(RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA),
                resolver.resolve(GithubApiService),
                resolver.resolve(GithubCommitDtoAssembler),
                resolver.resolve(GithubReleaseDtoAssembler),
                resolver.resolve(OptionalReaderFactory),
                resolver.resolve(CommitMessage),
                resolver.resolve(ActivityConfiguration),
                resolver.resolve(GithubCommitEndpointAssembler),
                resolver.resolve(GithubReleaseEndpointAssembler)
            )
    );
    registry.bind(
        GitHubContributionsProvider,
        () =>
            new GitHubContributionsProvider(
                resolver.resolve(BUILD_CLOCK),
                resolver.resolve(GithubApiService),
                resolver.resolve(OptionalReaderFactory),
                resolver.resolve(SignaleLoggerFactory),
                resolver.resolve(ReportingWindowCalculator)
            )
    );
    registry.bind(
        GitHubReleasesProvider,
        () =>
            new GitHubReleasesProvider(
                resolver.resolve(GithubApiService),
                resolver.resolve(OptionalReaderFactory),
                resolver.resolve(GithubReleaseEndpointAssembler)
            )
    );
    registry.bind(
        GitHubSearchProvider,
        () =>
            new GitHubSearchProvider(
                resolver.resolve(BUILD_CLOCK),
                resolver.resolve(GithubApiService),
                resolver.resolve(OptionalReaderFactory),
                resolver.resolve(ReportingWindowCalculator),
                resolver.resolve(GithubSearchEndpointAssembler)
            )
    );
    registry.bind(
        GitHubTrafficProvider,
        () =>
            new GitHubTrafficProvider(
                resolver.resolve(GithubApiService),
                resolver.resolve(OptionalReaderFactory),
                resolver.resolve(GithubTrafficEndpointAssembler),
                resolver.resolve(GithubAccessToken)
            )
    );
    registry.bind(
        GithubRepositoryCommitService,
        () =>
            new GithubRepositoryCommitService(
                resolver.resolve(GithubOptionalReader),
                resolver.resolve(GithubCommitEndpointAssembler),
                resolver.resolve(RepositoryCommitDtoAssembler),
                resolver.resolve(CheckRunsDtoAssembler),
                resolver.resolve(CommitMessage)
            )
    );
    registry.bind(
        GithubRepositoryDetailService,
        () =>
            new GithubRepositoryDetailService(
                resolver.resolve(GithubOptionalReader),
                resolver.resolve(GithubRepositoryDetailEndpointAssembler),
                resolver.resolve(GithubContentEndpointAssembler)
            )
    );
    registry.bind(
        GithubRepositoryDocumentTextService,
        () =>
            new GithubRepositoryDocumentTextService(
                resolver.resolve(GithubOptionalReader),
                resolver.resolve(GithubContentEndpointAssembler)
            )
    );
    registry.bind(
        GithubRepositoryDocumentsService,
        () =>
            new GithubRepositoryDocumentsService(
                resolver.resolve(GithubOptionalReader),
                resolver.resolve(GithubContentEndpointAssembler),
                resolver.resolve(RepositoryDocumentsFactory)
            )
    );
    registry.bind(
        GithubRepositoryReadmeService,
        () =>
            new GithubRepositoryReadmeService(
                resolver.resolve(GithubOptionalReader),
                resolver.resolve(GithubContentEndpointAssembler)
            )
    );
    registry.bind(
        GithubRepositoryReleaseService,
        () =>
            new GithubRepositoryReleaseService(
                resolver.resolve(GithubOptionalReader),
                resolver.resolve(GithubReleaseEndpointAssembler),
                resolver.resolve(GithubReleaseDtoAssembler)
            )
    );
    registry.bind(
        GithubRepositoryTotalsService,
        () =>
            new GithubRepositoryTotalsService(
                resolver.resolve(GithubOptionalReader),
                resolver.resolve(GithubGraphqlEndpointAssembler),
                resolver.resolve(GithubAccessToken),
                resolver.resolve(RepositoryTotalsQuery),
                resolver.resolve(RepositoryTotalsNodeDtoAssembler)
            )
    );
    registry.bind(
        GithubRepositoryTrafficService,
        () =>
            new GithubRepositoryTrafficService(
                resolver.resolve(GithubOptionalReader),
                resolver.resolve(GithubTrafficEndpointAssembler),
                resolver.resolve(GithubAccessToken)
            )
    );
    registry.bind(
        HomebrewInstallsProvider,
        () =>
            new HomebrewInstallsProvider(resolver.resolve(HomebrewApiService), resolver.resolve(OptionalReaderFactory))
    );
    registry.bind(InstallCommandResolver, () => new InstallCommandResolver());
    registry.bind(InstallCommandsFactory, () => new InstallCommandsFactory());
    registry.bind(
        LegacyDocumentAddressFactory,
        () => new LegacyDocumentAddressFactory(resolver.resolve(RoutePathResolver))
    );
    registry.bind(LegacyRedirectPage, () => new LegacyRedirectPage());
    registry.bind(
        LiveImpactDataProvider,
        () =>
            new LiveImpactDataProvider(
                resolver.resolve(RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA),
                resolver.resolve(NpmDownloadTotalsService),
                resolver.resolve(GitHubSearchProvider),
                resolver.resolve(GitHubReleasesProvider),
                resolver.resolve(GitHubTrafficProvider),
                resolver.resolve(GitHubContributionsProvider),
                [resolver.resolve(PypiOutletProvider), resolver.resolve(HomebrewInstallsProvider)],
                resolver.resolve(SnapcraftInstallsRetrievalService),
                resolver.resolve(ReleaseCountCalculator),
                resolver.resolve(OptionalReaderFactory),
                resolver.resolve(OutletDownloadsFactory),
                resolver.resolve(PeriodDownloadsCalculator),
                resolver.resolve(ReportingPeriods),
                resolver.resolve(SnapshotMetricsCalculator)
            )
    );
    registry.bind(
        LiveRepositoryProfileProvider,
        () =>
            new LiveRepositoryProfileProvider(
                resolver.resolve(RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA),
                resolver.resolve(RepositoryTotalsRetrievalService),
                resolver.resolve(GithubRepositoryCommitService),
                resolver.resolve(PackageListingProvider),
                resolver.resolve(GithubRepositoryDetailService),
                resolver.resolve(DependentsProvider),
                resolver.resolve(GithubRepositoryTrafficService),
                resolver.resolve(GithubRepositoryReadmeService),
                resolver.resolve(RepositoryDownloadsProvider),
                resolver.resolve(GithubRepositoryDocumentsService),
                resolver.resolve(GithubRepositoryReleaseService),
                resolver.resolve(RepositoryManualRenderer)
            )
    );
    registry.bind(MetricDeltaCalculator, () => new MetricDeltaCalculator());
    registry.bind(
        NpmDownloadTotalsRetrievalService,
        () =>
            new NpmDownloadTotalsRetrievalService(
                resolver.resolve(GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE),
                resolver.resolve(NpmDownloadTotalsService)
            )
    );
    registry.bind(NpmPackageDtoAssembler, () => new NpmPackageDtoAssembler());
    registry.bind(
        NpmPackageRegistryProbe,
        () => new NpmPackageRegistryProbe(resolver.resolve(NpmPackageDtoAssembler), resolver.resolve(PublisherIdentity))
    );
    registry.bind(OutletDownloadsFactory, () => new OutletDownloadsFactory());
    registry.bind(
        PackageListingProvider,
        () =>
            new PackageListingProvider(
                resolver.resolve(HttpApiService),
                resolver.resolve(OptionalReaderFactory),
                resolver.resolve(NpmPackageRegistryProbe),
                resolver.resolve(PypiPackageRegistryProbe),
                resolver.resolve(SnapcraftPackageRegistryProbe)
            )
    );
    registry.bind(PaginationConfiguration, () => new PaginationConfiguration());
    registry.bind(
        PeriodDeltasCalculator,
        () =>
            new PeriodDeltasCalculator(
                resolver.resolve(DownloadDeltaCalculator),
                resolver.resolve(MetricDeltaCalculator),
                resolver.resolve(ReportingPeriods)
            )
    );
    registry.bind(PeriodDownloadsCalculator, () => new PeriodDownloadsCalculator());
    registry.bind(PressCoverageFormatter, () => new PressCoverageFormatter(resolver.resolve(PressIssueFormatter)));
    registry.bind(PressIssueFormatter, () => new PressIssueFormatter());
    registry.bind(
        PressProjectResolver,
        () => new PressProjectResolver(resolver.resolve(RepositoryNameResolver), resolver.resolve(RoutePathResolver))
    );
    registry.bind(
        ProfileCollectionService,
        () =>
            new ProfileCollectionService(
                resolver.resolve(RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA),
                resolver.resolve(FeaturedSoftwareRetrievalService),
                resolver.resolve(REPOSITORY_CONFIGURATION),
                resolver.resolve(RepositoryProfileResolver),
                resolver.resolve(REPOSITORY_PROFILE_RETRIEVAL_SERVICE)
            )
    );
    registry.bind(PublicationConfiguration, () => new PublicationConfiguration());
    registry.bind(PublicationNeighbourResolver, () => new PublicationNeighbourResolver());
    registry.bind(
        PublicationQueryService,
        () => new PublicationQueryService(resolver.resolve(SlugFormatter), resolver.resolve(PublicationConfiguration))
    );
    registry.bind(PublishedReleaseResolver, () => new PublishedReleaseResolver(resolver.resolve(ReleaseSlugFormatter)));
    registry.bind(PublisherIdentity, () => new PublisherIdentity());
    registry.bind(PublisherMarksFactory, () => new PublisherMarksFactory());
    registry.bind(
        PypiOutletProvider,
        () => new PypiOutletProvider(resolver.resolve(PypiDownloadApiService), resolver.resolve(OptionalReaderFactory))
    );
    registry.bind(PypiPackageDtoAssembler, () => new PypiPackageDtoAssembler());
    registry.bind(
        PypiPackageRegistryProbe,
        () =>
            new PypiPackageRegistryProbe(resolver.resolve(PypiPackageDtoAssembler), resolver.resolve(PublisherIdentity))
    );
    registry.bind(ReadingTimeResolver, () => new ReadingTimeResolver(resolver.resolve(WordCounter)));
    registry.bind(RelatedPublicationResolver, () => new RelatedPublicationResolver());
    registry.bind(
        RelatedRepositoryResolver,
        () => new RelatedRepositoryResolver(resolver.resolve(REPOSITORY_CONFIGURATION))
    );
    registry.bind(
        ReleaseAddressResolver,
        () =>
            new ReleaseAddressResolver(
                resolver.resolve(PublishedReleaseResolver),
                resolver.resolve(ReleaseSlugFormatter),
                resolver.resolve(RoutePathResolver)
            )
    );
    registry.bind(ReleaseCadenceFormatter, () => new ReleaseCadenceFormatter(resolver.resolve(DatetimeFormatter)));
    registry.bind(ReleaseComparisonResolver, () => new ReleaseComparisonResolver());
    registry.bind(
        ReleaseCountCalculator,
        () => new ReleaseCountCalculator(resolver.resolve(BUILD_CLOCK), resolver.resolve(ReportingWindowCalculator))
    );
    registry.bind(ReleaseHistoryFactory, () => new ReleaseHistoryFactory());
    registry.bind(ReleaseInstallCommandResolver, () => new ReleaseInstallCommandResolver());
    registry.bind(ReleaseMessaging, () => new ReleaseMessaging());
    registry.bind(
        ReleaseNotesRenderer,
        () => new ReleaseNotesRenderer(resolver.resolve(MarkdownRenderer), resolver.resolve(RepositoryAddressResolver))
    );
    registry.bind(
        ReleasePageMetadataFactory,
        () =>
            new ReleasePageMetadataFactory(
                resolver.resolve(DatetimeFormatter),
                resolver.resolve(NumberFormatter),
                resolver.resolve(PageTitleFormatter),
                resolver.resolve(ReleaseSummaryFormatter)
            )
    );
    registry.bind(ReleaseSlugFormatter, () => new ReleaseSlugFormatter());
    registry.bind(ReleaseSummaryFormatter, () => new ReleaseSummaryFormatter());
    registry.bind(RepositoryAddressResolver, () => new RepositoryAddressResolver());
    registry.bind(RepositoryCommitDtoAssembler, () => new RepositoryCommitDtoAssembler());
    registry.bind(
        RepositoryDocumentDescriptionFactory,
        () => new RepositoryDocumentDescriptionFactory(resolver.resolve(RepositoryDocumentKinds))
    );
    registry.bind(RepositoryDocumentKinds, () => new RepositoryDocumentKinds());
    registry.bind(
        RepositoryDocumentRenderer,
        () =>
            new RepositoryDocumentRenderer(
                resolver.resolve(MarkdownRenderer),
                resolver.resolve(RepositoryAddressResolver)
            )
    );
    registry.bind(
        RepositoryDocumentsFactory,
        () =>
            new RepositoryDocumentsFactory(
                resolver.resolve(DocumentLanguages),
                resolver.resolve(RepositoryDocumentKinds)
            )
    );
    registry.bind(RepositoryDownloadChart, () => new RepositoryDownloadChart(resolver.resolve(RepositoryFacts)));
    registry.bind(RepositoryDownloadsCalculator, () => new RepositoryDownloadsCalculator());
    registry.bind(
        RepositoryDownloadsProvider,
        () =>
            new RepositoryDownloadsProvider(
                resolver.resolve(NpmDownloadTotalsRetrievalService),
                resolver.resolve(PypiDownloadApiService),
                resolver.resolve(SnapcraftInstallsRetrievalService),
                resolver.resolve(OptionalReaderFactory),
                resolver.resolve(DownloadActivity),
                resolver.resolve(RepositoryDownloadsCalculator)
            )
    );
    registry.bind(RepositoryFacts, () => new RepositoryFacts());
    registry.bind(RepositoryFigureClusterFactory, () => new RepositoryFigureClusterFactory());
    registry.bind(RepositoryLicenseResolver, () => new RepositoryLicenseResolver());
    registry.bind(RepositoryLinkFactory, () => new RepositoryLinkFactory());
    registry.bind(
        RepositoryManualRenderer,
        () =>
            new RepositoryManualRenderer(
                resolver.resolve(InstallCommandResolver),
                resolver.resolve(MarkdownRenderer),
                resolver.resolve(RepositoryAddressResolver),
                resolver.resolve(StatedRelatedProjectsResolver)
            )
    );
    registry.bind(
        RepositoryMetadataFactory,
        () =>
            new RepositoryMetadataFactory(
                resolver.resolve(CommitChecksFormatter),
                resolver.resolve(CommitShaFormatter),
                resolver.resolve(DatetimeFormatter),
                resolver.resolve(NumberFormatter)
            )
    );
    registry.bind(
        RepositoryOgDetailsResolver,
        () =>
            new RepositoryOgDetailsResolver(
                resolver.resolve(NumberFormatter),
                resolver.resolve(RepositoryFacts),
                resolver.resolve(RoutePathResolver)
            )
    );
    registry.bind(
        RepositoryPageMetadataFactory,
        () => new RepositoryPageMetadataFactory(resolver.resolve(NumberFormatter), resolver.resolve(PageTitleFormatter))
    );
    registry.bind(
        RepositoryPageNavigationFactory,
        () => new RepositoryPageNavigationFactory(resolver.resolve(RoutePathResolver))
    );
    registry.bind(RepositoryProfileResolver, () => new RepositoryProfileResolver());
    registry.bind(
        RepositorySignalsResolver,
        () =>
            new RepositorySignalsResolver(
                resolver.resolve(CommitShaFormatter),
                resolver.resolve(RepositoryFacts),
                resolver.resolve(SoftwareSignalsFactory)
            )
    );
    registry.bind(
        RepositorySignalsSource,
        () =>
            new RepositorySignalsSource(
                resolver.resolve(REPOSITORY_PROFILE_RETRIEVAL_SERVICE),
                resolver.resolve(RepositorySignalsResolver)
            )
    );
    registry.bind(
        RepositorySubPageMetadataFactory,
        () =>
            new RepositorySubPageMetadataFactory(
                resolver.resolve(DatetimeFormatter),
                resolver.resolve(PageTitleFormatter)
            )
    );
    registry.bind(
        RepositoryTotalsNodeDtoAssembler,
        () => new RepositoryTotalsNodeDtoAssembler(resolver.resolve(CountedDtoAssembler))
    );
    registry.bind(RepositoryTotalsQuery, () => new RepositoryTotalsQuery());
    registry.bind(
        RepositoryTotalsRetrievalService,
        () =>
            new RepositoryTotalsRetrievalService(
                resolver.resolve(RETRIEVAL_SERVICE_GITHUB_REPOSITORY_DATA),
                resolver.resolve(GithubRepositoryTotalsService)
            )
    );
    registry.bind(RepositoryTrailFactory, () => new RepositoryTrailFactory(resolver.resolve(RoutePathResolver)));
    registry.bind(SearchCursor, () => new SearchCursor());
    registry.bind(SearchDestination, () => new SearchDestination());
    registry.bind(SearchHighlightFactory, () => new SearchHighlightFactory());
    registry.bind(
        SearchIndexFactory,
        () =>
            new SearchIndexFactory(
                resolver.resolve(DatetimeFormatter),
                resolver.resolve(NumberFormatter),
                resolver.resolve(PressIssueFormatter),
                resolver.resolve(RoutePathResolver),
                resolver.resolve(TitleFormatter)
            )
    );
    registry.bind(SearchItemKinds, () => new SearchItemKinds());
    registry.bind(SearchKindTally, () => new SearchKindTally());
    registry.bind(SearchQueryUrlResolver, () => new SearchQueryUrlResolver());
    registry.bind(SearchQueryValidator, () => new SearchQueryValidator());
    registry.bind(SearchSubjectsFactory, () => new SearchSubjectsFactory());
    registry.bind(ShareLinksFactory, () => new ShareLinksFactory());
    registry.bind(SnapChannelVersionDtoAssembler, () => new SnapChannelVersionDtoAssembler());
    registry.bind(
        SnapPackageDtoAssembler,
        () => new SnapPackageDtoAssembler(resolver.resolve(SnapChannelVersionDtoAssembler))
    );
    registry.bind(
        SnapcraftInstallsRetrievalService,
        () =>
            new SnapcraftInstallsRetrievalService(
                resolver.resolve(GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE),
                resolver.resolve(SnapcraftSnapApiService),
                resolver.resolve(SnapcraftMetricsApiService),
                resolver.resolve(OptionalReaderFactory)
            )
    );
    registry.bind(
        SnapcraftPackageRegistryProbe,
        () =>
            new SnapcraftPackageRegistryProbe(
                resolver.resolve(SnapPackageDtoAssembler),
                resolver.resolve(PublisherIdentity)
            )
    );
    registry.bind(SnapshotMetricsCalculator, () => new SnapshotMetricsCalculator());
    registry.bind(SoftwareConfiguration, () => new SoftwareConfiguration());
    registry.bind(SoftwareFactory, () => new SoftwareFactory());
    registry.bind(
        SoftwareRetrievalService,
        () =>
            new SoftwareRetrievalService(
                resolver.resolve(GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE),
                resolver.resolve(SoftwareFactory)
            )
    );
    registry.bind(SoftwareSignalsFactory, () => new SoftwareSignalsFactory());
    registry.bind(StatedRelatedProjectsResolver, () => new StatedRelatedProjectsResolver());
    registry.bind(TagPageMetadataResolver, () => new TagPageMetadataResolver());
};
