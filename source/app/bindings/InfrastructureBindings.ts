import type { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import type { InstanceResolver } from "@app/injection/InstanceResolver.ts";
import { HTTP_REQUEST_EXECUTOR, PUBLIC_ASSET_RESOLVER } from "@app/injection/ApplicationKeys.ts";
import { AuthorPortraitResolver } from "@app/infrastructure/file/asset/AuthorPortraitResolver.ts";
import { CachingHttpClient } from "@app/infrastructure/http/client/CachingHttpClient.ts";
import { ContentCollectionService } from "@app/infrastructure/content/ContentCollectionService.ts";
import { ContentEntryOrderComparator } from "@app/infrastructure/content/entry/ContentEntryOrderComparator.ts";
import { ContentEntryPublicationFilter } from "@app/infrastructure/content/entry/ContentEntryPublicationFilter.ts";
import { DataSource } from "@app/infrastructure/common/DataSource.ts";
import { EndpointAssembler } from "@app/infrastructure/http/request/EndpointAssembler.ts";
import { GithubAccessToken } from "@app/infrastructure/api/github/common/GithubAccessToken.ts";
import { GithubApiService } from "@app/infrastructure/api/github/common/GithubApiService.ts";
import { GithubAuthoredCommitMapper } from "@app/infrastructure/api/github/commit/GithubAuthoredCommitMapper.ts";
import { GithubCommitApiService } from "@app/infrastructure/api/github/commit/GithubCommitApiService.ts";
import { GithubCommitDtoAssembler } from "@app/infrastructure/api/github/commit/GithubCommitDtoAssembler.ts";
import { GithubCommitEndpointAssembler } from "@app/infrastructure/api/github/commit/GithubCommitEndpointAssembler.ts";
import { GithubContentEndpointAssembler } from "@app/infrastructure/api/github/content/GithubContentEndpointAssembler.ts";
import { GithubDependentsApiService } from "@app/infrastructure/api/github/dependents/GithubDependentsApiService.ts";
import { GithubGraphqlEndpointAssembler } from "@app/infrastructure/api/github/common/GithubGraphqlEndpointAssembler.ts";
import { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader.ts";
import { GithubReleaseDtoAssembler } from "@app/infrastructure/api/github/release/GithubReleaseDtoAssembler.ts";
import { GithubReleaseEndpointAssembler } from "@app/infrastructure/api/github/release/GithubReleaseEndpointAssembler.ts";
import { GithubRepositoryApiService } from "@app/infrastructure/api/github/repository/GithubRepositoryApiService.ts";
import { GithubRepositoryDataMapper } from "@app/infrastructure/api/github/repository/data/GithubRepositoryDataMapper.ts";
import { GithubRepositoryDetailEndpointAssembler } from "@app/infrastructure/api/github/repository/request/GithubRepositoryDetailEndpointAssembler.ts";
import { GithubRepositoryDtoAssembler } from "@app/infrastructure/api/github/repository/response/GithubRepositoryDtoAssembler.ts";
import { GithubRepositoryEndpointAssembler } from "@app/infrastructure/api/github/repository/request/GithubRepositoryEndpointAssembler.ts";
import { GithubRequestHeadersFactory } from "@app/infrastructure/api/github/common/GithubRequestHeadersFactory.ts";
import { GithubSearchEndpointAssembler } from "@app/infrastructure/api/github/search/GithubSearchEndpointAssembler.ts";
import { GithubTrafficEndpointAssembler } from "@app/infrastructure/api/github/traffic/GithubTrafficEndpointAssembler.ts";
import { GoogleFontLoader } from "@app/infrastructure/render/og/font/GoogleFontLoader.ts";
import { HomebrewApiService } from "@app/infrastructure/api/homebrew/HomebrewApiService.ts";
import { HttpApiService } from "@app/infrastructure/http/HttpApiService.ts";
import { HttpClient } from "@app/infrastructure/http/client/HttpClient.ts";
import { HttpRequestAssembler } from "@app/infrastructure/http/request/HttpRequestAssembler.ts";
import { HttpRequestFactory } from "@app/infrastructure/http/request/HttpRequestFactory.ts";
import { HttpRequestOptionsFactory } from "@app/infrastructure/http/request/HttpRequestOptionsFactory.ts";
import { HttpResponseAssembler } from "@app/infrastructure/http/response/HttpResponseAssembler.ts";
import { HttpResponseFileNameFactory } from "@app/infrastructure/http/cache/HttpResponseFileNameFactory.ts";
import { HttpResponseFileParser } from "@app/infrastructure/http/cache/HttpResponseFileParser.ts";
import { HttpResponseFilePathResolver } from "@app/infrastructure/http/cache/HttpResponseFilePathResolver.ts";
import { HttpResponseFilePersistenceService } from "@app/infrastructure/http/cache/HttpResponseFilePersistenceService.ts";
import { HttpResponseFileRetrievalService } from "@app/infrastructure/http/cache/HttpResponseFileRetrievalService.ts";
import { HttpResponseFileSerializer } from "@app/infrastructure/http/cache/HttpResponseFileSerializer.ts";
import { HttpResponseJsonParser } from "@app/infrastructure/http/response/HttpResponseJsonParser.ts";
import { MarkdownPictureRestorer } from "@app/infrastructure/render/markdown/MarkdownPictureRestorer.ts";
import { MarkdownRenderer } from "@app/infrastructure/render/markdown/MarkdownRenderer.ts";
import { NpmApiService } from "@app/infrastructure/api/npm/common/NpmApiService.ts";
import { NpmBulkDownloadRangeDtoAssembler } from "@app/infrastructure/api/npm/download/response/NpmBulkDownloadRangeDtoAssembler.ts";
import { NpmDownloadApiService } from "@app/infrastructure/api/npm/download/NpmDownloadApiService.ts";
import { NpmDownloadCountGrouper } from "@app/infrastructure/api/npm/download/count/NpmDownloadCountGrouper.ts";
import { NpmDownloadCountMapper } from "@app/infrastructure/api/npm/download/count/NpmDownloadCountMapper.ts";
import { NpmDownloadDateRangeFactory } from "@app/infrastructure/api/npm/download/request/NpmDownloadDateRangeFactory.ts";
import { NpmDownloadDtoAssembler } from "@app/infrastructure/api/npm/download/response/NpmDownloadDtoAssembler.ts";
import { NpmDownloadEndpointAssembler } from "@app/infrastructure/api/npm/download/request/NpmDownloadEndpointAssembler.ts";
import { NpmDownloadPublicationTrimmer } from "@app/infrastructure/api/npm/download/count/NpmDownloadPublicationTrimmer.ts";
import { NpmDownloadRangeDtoAssembler } from "@app/infrastructure/api/npm/download/response/NpmDownloadRangeDtoAssembler.ts";
import { NpmDownloadTotalsCalculator } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotalsCalculator.ts";
import { NpmDownloadTotalsFactory } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotalsFactory.ts";
import { NpmDownloadTotalsService } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotalsService.ts";
import { OgImageRenderingService } from "@app/infrastructure/render/og/OgImageRenderingService.ts";
import { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory.ts";
import { PageCards } from "@app/infrastructure/render/og/details/PageCards.ts";
import { PageOgAddressAssembler } from "@app/infrastructure/render/og/details/PageOgAddressAssembler.ts";
import { PageOgDetailsAssembler } from "@app/infrastructure/render/og/details/PageOgDetailsAssembler.ts";
import { PypiApiService } from "@app/infrastructure/api/pypi/common/PypiApiService.ts";
import { PypiDailyDownloadDtoAssembler } from "@app/infrastructure/api/pypi/download/response/PypiDailyDownloadDtoAssembler.ts";
import { PypiDownloadApiService } from "@app/infrastructure/api/pypi/download/PypiDownloadApiService.ts";
import { PypiDownloadEndpointAssembler } from "@app/infrastructure/api/pypi/download/request/PypiDownloadEndpointAssembler.ts";
import { PypiDownloadWindowCalculator } from "@app/infrastructure/api/pypi/download/window/PypiDownloadWindowCalculator.ts";
import { PypiOverallDownloadsDtoAssembler } from "@app/infrastructure/api/pypi/download/response/PypiOverallDownloadsDtoAssembler.ts";
import { PypiRecentDownloadsDtoAssembler } from "@app/infrastructure/api/pypi/download/response/PypiRecentDownloadsDtoAssembler.ts";
import { RenderedSectionMapper } from "@app/infrastructure/content/section/RenderedSectionMapper.ts";
import { RenderedSectionService } from "@app/infrastructure/content/section/RenderedSectionService.ts";
import { ReportingPeriods } from "@app/util/period/ReportingPeriods.ts";
import { RepositoryOgDetailsAssembler } from "@app/infrastructure/render/og/details/RepositoryOgDetailsAssembler.ts";
import { SignaleLoggerFactory } from "@app/infrastructure/log/SignaleLoggerFactory.ts";
import { SnapcraftApiService } from "@app/infrastructure/api/snapcraft/common/SnapcraftApiService.ts";
import { SnapcraftInstallsCalculator } from "@app/infrastructure/api/snapcraft/metrics/SnapcraftInstallsCalculator.ts";
import { SnapcraftMacaroonAssembler } from "@app/infrastructure/api/snapcraft/macaroon/SnapcraftMacaroonAssembler.ts";
import { SnapcraftMacaroonBinder } from "@app/infrastructure/api/snapcraft/macaroon/SnapcraftMacaroonBinder.ts";
import { SnapcraftMacaroonParser } from "@app/infrastructure/api/snapcraft/macaroon/SnapcraftMacaroonParser.ts";
import { SnapcraftMetricsAnswerDtoAssembler } from "@app/infrastructure/api/snapcraft/metrics/response/SnapcraftMetricsAnswerDtoAssembler.ts";
import { SnapcraftMetricsApiService } from "@app/infrastructure/api/snapcraft/metrics/SnapcraftMetricsApiService.ts";
import { SnapcraftMetricsRequestDtoFactory } from "@app/infrastructure/api/snapcraft/metrics/request/SnapcraftMetricsRequestDtoFactory.ts";
import { SnapcraftMetricsResultDtoAssembler } from "@app/infrastructure/api/snapcraft/metrics/response/SnapcraftMetricsResultDtoAssembler.ts";
import { SnapcraftMetricsSeriesDtoAssembler } from "@app/infrastructure/api/snapcraft/metrics/response/SnapcraftMetricsSeriesDtoAssembler.ts";
import { SnapcraftRequestHeadersFactory } from "@app/infrastructure/api/snapcraft/common/SnapcraftRequestHeadersFactory.ts";
import { SnapcraftSnapApiService } from "@app/infrastructure/api/snapcraft/snap/SnapcraftSnapApiService.ts";
import { SnapcraftSnapDtoAssembler } from "@app/infrastructure/api/snapcraft/snap/SnapcraftSnapDtoAssembler.ts";
import { SnapcraftStoreCredential } from "@app/infrastructure/api/snapcraft/common/SnapcraftStoreCredential.ts";
import { SnapcraftStoreCredentialDtoAssembler } from "@app/infrastructure/api/snapcraft/common/SnapcraftStoreCredentialDtoAssembler.ts";
import { SnapcraftStoreCredentialParser } from "@app/infrastructure/api/snapcraft/common/SnapcraftStoreCredentialParser.ts";

export const bindInfrastructure = (registry: InstanceFactoryRegistry, resolver: InstanceResolver): void => {
    registry.bind(AuthorPortraitResolver, () => new AuthorPortraitResolver(resolver.resolve(PUBLIC_ASSET_RESOLVER)));
    registry.bind(
        CachingHttpClient,
        () =>
            new CachingHttpClient(
                resolver.resolve(HttpClient),
                resolver.resolve(HttpResponseFileRetrievalService),
                resolver.resolve(HttpResponseFilePersistenceService),
                resolver.resolve(OptionalReaderFactory)
            )
    );
    registry.bind(
        ContentCollectionService,
        () =>
            new ContentCollectionService(
                resolver.resolve(ContentEntryPublicationFilter),
                resolver.resolve(ContentEntryOrderComparator)
            )
    );
    registry.bind(ContentEntryOrderComparator, () => new ContentEntryOrderComparator());
    registry.bind(ContentEntryPublicationFilter, () => new ContentEntryPublicationFilter());
    registry.bind(DataSource, () => new DataSource());
    registry.bind(EndpointAssembler, () => new EndpointAssembler());
    registry.bind(GithubAccessToken, () => new GithubAccessToken());
    registry.bind(
        GithubApiService,
        () => new GithubApiService(resolver.resolve(HttpApiService), resolver.resolve(GithubRequestHeadersFactory))
    );
    registry.bind(GithubAuthoredCommitMapper, () => new GithubAuthoredCommitMapper());
    registry.bind(
        GithubCommitApiService,
        () =>
            new GithubCommitApiService(
                resolver.resolve(GithubApiService),
                resolver.resolve(GithubCommitEndpointAssembler),
                resolver.resolve(GithubAuthoredCommitMapper),
                resolver.resolve(GithubCommitDtoAssembler)
            )
    );
    registry.bind(GithubCommitDtoAssembler, () => new GithubCommitDtoAssembler());
    registry.bind(GithubCommitEndpointAssembler, () => new GithubCommitEndpointAssembler());
    registry.bind(GithubContentEndpointAssembler, () => new GithubContentEndpointAssembler());
    registry.bind(GithubDependentsApiService, () => new GithubDependentsApiService(resolver.resolve(HttpApiService)));
    registry.bind(GithubGraphqlEndpointAssembler, () => new GithubGraphqlEndpointAssembler());
    registry.bind(
        GithubOptionalReader,
        () => new GithubOptionalReader(resolver.resolve(GithubApiService), resolver.resolve(OptionalReaderFactory))
    );
    registry.bind(GithubReleaseDtoAssembler, () => new GithubReleaseDtoAssembler());
    registry.bind(GithubReleaseEndpointAssembler, () => new GithubReleaseEndpointAssembler());
    registry.bind(
        GithubRepositoryApiService,
        () =>
            new GithubRepositoryApiService(
                resolver.resolve(GithubApiService),
                resolver.resolve(GithubRepositoryEndpointAssembler),
                resolver.resolve(GithubRepositoryDataMapper),
                resolver.resolve(GithubRepositoryDtoAssembler)
            )
    );
    registry.bind(GithubRepositoryDataMapper, () => new GithubRepositoryDataMapper());
    registry.bind(GithubRepositoryDetailEndpointAssembler, () => new GithubRepositoryDetailEndpointAssembler());
    registry.bind(GithubRepositoryDtoAssembler, () => new GithubRepositoryDtoAssembler());
    registry.bind(GithubRepositoryEndpointAssembler, () => new GithubRepositoryEndpointAssembler());
    registry.bind(
        GithubRequestHeadersFactory,
        () => new GithubRequestHeadersFactory(resolver.resolve(GithubAccessToken))
    );
    registry.bind(GithubSearchEndpointAssembler, () => new GithubSearchEndpointAssembler());
    registry.bind(GithubTrafficEndpointAssembler, () => new GithubTrafficEndpointAssembler());
    registry.bind(GoogleFontLoader, () => new GoogleFontLoader());
    registry.bind(HomebrewApiService, () => new HomebrewApiService(resolver.resolve(HttpApiService)));
    registry.bind(
        HttpApiService,
        () =>
            new HttpApiService(
                resolver.resolve(HTTP_REQUEST_EXECUTOR),
                resolver.resolve(HttpRequestFactory),
                resolver.resolve(EndpointAssembler),
                resolver.resolve(HttpRequestOptionsFactory),
                resolver.resolve(HttpResponseJsonParser)
            )
    );
    registry.bind(
        HttpClient,
        () => new HttpClient(resolver.resolve(HttpRequestAssembler), resolver.resolve(HttpResponseAssembler))
    );
    registry.bind(HttpRequestAssembler, () => new HttpRequestAssembler());
    registry.bind(HttpRequestFactory, () => new HttpRequestFactory());
    registry.bind(HttpRequestOptionsFactory, () => new HttpRequestOptionsFactory());
    registry.bind(HttpResponseAssembler, () => new HttpResponseAssembler());
    registry.bind(HttpResponseFileNameFactory, () => new HttpResponseFileNameFactory());
    registry.bind(HttpResponseFileParser, () => new HttpResponseFileParser());
    registry.bind(
        HttpResponseFilePathResolver,
        () => new HttpResponseFilePathResolver(resolver.resolve(HttpResponseFileNameFactory))
    );
    registry.bind(
        HttpResponseFilePersistenceService,
        () =>
            new HttpResponseFilePersistenceService(
                resolver.resolve(HttpResponseFilePathResolver),
                resolver.resolve(HttpResponseFileSerializer)
            )
    );
    registry.bind(
        HttpResponseFileRetrievalService,
        () =>
            new HttpResponseFileRetrievalService(
                resolver.resolve(HttpResponseFilePathResolver),
                resolver.resolve(HttpResponseFileParser),
                resolver.resolve(OptionalReaderFactory)
            )
    );
    registry.bind(HttpResponseFileSerializer, () => new HttpResponseFileSerializer());
    registry.bind(HttpResponseJsonParser, () => new HttpResponseJsonParser());
    registry.bind(MarkdownPictureRestorer, () => new MarkdownPictureRestorer());
    registry.bind(MarkdownRenderer, () => new MarkdownRenderer(resolver.resolve(MarkdownPictureRestorer)));
    registry.bind(NpmApiService, () => new NpmApiService(resolver.resolve(HttpApiService)));
    registry.bind(
        NpmBulkDownloadRangeDtoAssembler,
        () => new NpmBulkDownloadRangeDtoAssembler(resolver.resolve(NpmDownloadRangeDtoAssembler))
    );
    registry.bind(
        NpmDownloadApiService,
        () =>
            new NpmDownloadApiService(
                resolver.resolve(NpmApiService),
                resolver.resolve(NpmDownloadEndpointAssembler),
                resolver.resolve(NpmDownloadCountMapper),
                resolver.resolve(NpmDownloadRangeDtoAssembler),
                resolver.resolve(NpmBulkDownloadRangeDtoAssembler)
            )
    );
    registry.bind(NpmDownloadCountGrouper, () => new NpmDownloadCountGrouper());
    registry.bind(NpmDownloadCountMapper, () => new NpmDownloadCountMapper());
    registry.bind(NpmDownloadDateRangeFactory, () => new NpmDownloadDateRangeFactory());
    registry.bind(NpmDownloadDtoAssembler, () => new NpmDownloadDtoAssembler());
    registry.bind(NpmDownloadEndpointAssembler, () => new NpmDownloadEndpointAssembler());
    registry.bind(NpmDownloadPublicationTrimmer, () => new NpmDownloadPublicationTrimmer());
    registry.bind(
        NpmDownloadRangeDtoAssembler,
        () => new NpmDownloadRangeDtoAssembler(resolver.resolve(NpmDownloadDtoAssembler))
    );
    registry.bind(
        NpmDownloadTotalsCalculator,
        () =>
            new NpmDownloadTotalsCalculator(
                resolver.resolve(ReportingPeriods),
                resolver.resolve(NpmDownloadPublicationTrimmer)
            )
    );
    registry.bind(NpmDownloadTotalsFactory, () => new NpmDownloadTotalsFactory());
    registry.bind(
        NpmDownloadTotalsService,
        () =>
            new NpmDownloadTotalsService(
                resolver.resolve(NpmDownloadApiService),
                resolver.resolve(NpmDownloadDateRangeFactory),
                resolver.resolve(NpmDownloadCountGrouper),
                resolver.resolve(NpmDownloadTotalsCalculator),
                resolver.resolve(NpmDownloadTotalsFactory)
            )
    );
    registry.bind(OgImageRenderingService, () => new OgImageRenderingService());
    registry.bind(OptionalReaderFactory, () => new OptionalReaderFactory(resolver.resolve(SignaleLoggerFactory)));
    registry.bind(PageCards, () => new PageCards(resolver.resolve(PageOgAddressAssembler)));
    registry.bind(PageOgAddressAssembler, () => new PageOgAddressAssembler());
    registry.bind(PageOgDetailsAssembler, () => new PageOgDetailsAssembler());
    registry.bind(PypiApiService, () => new PypiApiService(resolver.resolve(HttpApiService)));
    registry.bind(PypiDailyDownloadDtoAssembler, () => new PypiDailyDownloadDtoAssembler());
    registry.bind(
        PypiDownloadApiService,
        () =>
            new PypiDownloadApiService(
                resolver.resolve(PypiApiService),
                resolver.resolve(PypiDownloadEndpointAssembler),
                resolver.resolve(PypiDownloadWindowCalculator),
                resolver.resolve(PypiRecentDownloadsDtoAssembler),
                resolver.resolve(PypiOverallDownloadsDtoAssembler)
            )
    );
    registry.bind(PypiDownloadEndpointAssembler, () => new PypiDownloadEndpointAssembler());
    registry.bind(PypiDownloadWindowCalculator, () => new PypiDownloadWindowCalculator());
    registry.bind(
        PypiOverallDownloadsDtoAssembler,
        () => new PypiOverallDownloadsDtoAssembler(resolver.resolve(PypiDailyDownloadDtoAssembler))
    );
    registry.bind(PypiRecentDownloadsDtoAssembler, () => new PypiRecentDownloadsDtoAssembler());
    registry.bind(RenderedSectionMapper, () => new RenderedSectionMapper());
    registry.bind(
        RenderedSectionService,
        () =>
            new RenderedSectionService(
                resolver.resolve(ContentCollectionService),
                resolver.resolve(RenderedSectionMapper)
            )
    );
    registry.bind(RepositoryOgDetailsAssembler, () => new RepositoryOgDetailsAssembler());
    registry.bind(SignaleLoggerFactory, () => new SignaleLoggerFactory());
    registry.bind(
        SnapcraftApiService,
        () =>
            new SnapcraftApiService(resolver.resolve(HttpApiService), resolver.resolve(SnapcraftRequestHeadersFactory))
    );
    registry.bind(SnapcraftInstallsCalculator, () => new SnapcraftInstallsCalculator());
    registry.bind(SnapcraftMacaroonAssembler, () => new SnapcraftMacaroonAssembler());
    registry.bind(
        SnapcraftMacaroonBinder,
        () =>
            new SnapcraftMacaroonBinder(
                resolver.resolve(SnapcraftMacaroonParser),
                resolver.resolve(SnapcraftMacaroonAssembler)
            )
    );
    registry.bind(SnapcraftMacaroonParser, () => new SnapcraftMacaroonParser());
    registry.bind(
        SnapcraftMetricsAnswerDtoAssembler,
        () => new SnapcraftMetricsAnswerDtoAssembler(resolver.resolve(SnapcraftMetricsResultDtoAssembler))
    );
    registry.bind(
        SnapcraftMetricsApiService,
        () =>
            new SnapcraftMetricsApiService(
                resolver.resolve(SnapcraftApiService),
                resolver.resolve(SnapcraftStoreCredential),
                resolver.resolve(SnapcraftMetricsRequestDtoFactory),
                resolver.resolve(SnapcraftInstallsCalculator),
                resolver.resolve(SnapcraftMetricsAnswerDtoAssembler)
            )
    );
    registry.bind(SnapcraftMetricsRequestDtoFactory, () => new SnapcraftMetricsRequestDtoFactory());
    registry.bind(
        SnapcraftMetricsResultDtoAssembler,
        () => new SnapcraftMetricsResultDtoAssembler(resolver.resolve(SnapcraftMetricsSeriesDtoAssembler))
    );
    registry.bind(SnapcraftMetricsSeriesDtoAssembler, () => new SnapcraftMetricsSeriesDtoAssembler());
    registry.bind(
        SnapcraftRequestHeadersFactory,
        () =>
            new SnapcraftRequestHeadersFactory(
                resolver.resolve(SnapcraftStoreCredential),
                resolver.resolve(SnapcraftStoreCredentialParser),
                resolver.resolve(SnapcraftMacaroonBinder)
            )
    );
    registry.bind(
        SnapcraftSnapApiService,
        () => new SnapcraftSnapApiService(resolver.resolve(HttpApiService), resolver.resolve(SnapcraftSnapDtoAssembler))
    );
    registry.bind(SnapcraftSnapDtoAssembler, () => new SnapcraftSnapDtoAssembler());
    registry.bind(SnapcraftStoreCredential, () => new SnapcraftStoreCredential());
    registry.bind(SnapcraftStoreCredentialDtoAssembler, () => new SnapcraftStoreCredentialDtoAssembler());
    registry.bind(
        SnapcraftStoreCredentialParser,
        () => new SnapcraftStoreCredentialParser(resolver.resolve(SnapcraftStoreCredentialDtoAssembler))
    );
};
