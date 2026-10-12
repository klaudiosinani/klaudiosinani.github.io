import type { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import type { InstanceResolver } from "@app/injection/InstanceResolver.ts";
import { BlogPostingSchemaBuilder } from "@app/util/seo/article/BlogPostingSchemaBuilder.ts";
import { BreadcrumbListSchemaBuilder } from "@app/util/seo/breadcrumb/BreadcrumbListSchemaBuilder.ts";
import { BreadcrumbStepsFactory } from "@app/util/seo/breadcrumb/BreadcrumbStepsFactory.ts";
import { BreadcrumbTrailResolver } from "@app/util/routing/BreadcrumbTrailResolver.ts";
import { ChartPointsFactory } from "@app/util/chart/ChartPointsFactory.ts";
import { CollectionPageSchemaBuilder } from "@app/util/seo/page/CollectionPageSchemaBuilder.ts";
import { CommitMessage } from "@app/util/text/CommitMessage.ts";
import { CommitShaFormatter } from "@app/util/text/CommitShaFormatter.ts";
import { CountFormatter } from "@app/util/text/CountFormatter.ts";
import { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter.ts";
import { DisplayDatetimeResolver } from "@app/util/datetime/DisplayDatetimeResolver.ts";
import { KeywordNameFormatter } from "@app/util/text/KeywordNameFormatter.ts";
import { LanguageColorResolver } from "@app/util/language/LanguageColorResolver.ts";
import { LastCompleteMonthResolver } from "@app/util/period/LastCompleteMonthResolver.ts";
import { ListFormatter } from "@app/util/text/ListFormatter.ts";
import { MarkdownLinkFormatter } from "@app/util/text/MarkdownLinkFormatter.ts";
import { MonotoneCurveCalculator } from "@app/util/chart/MonotoneCurveCalculator.ts";
import { MonthEndCalculator } from "@app/util/period/MonthEndCalculator.ts";
import { MonthGroupFactory } from "@app/util/period/MonthGroupFactory.ts";
import { MonthGrouper } from "@app/util/period/MonthGrouper.ts";
import { NearestNameResolver } from "@app/util/text/NearestNameResolver.ts";
import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";
import { PageBreadcrumbsResolver } from "@app/util/seo/breadcrumb/PageBreadcrumbsResolver.ts";
import { PageTitleFormatter } from "@app/util/text/PageTitleFormatter.ts";
import { PersonSchemaBuilder } from "@app/util/seo/site/PersonSchemaBuilder.ts";
import { ProfilePageSchemaBuilder } from "@app/util/seo/page/ProfilePageSchemaBuilder.ts";
import { ReportingPeriods } from "@app/util/period/ReportingPeriods.ts";
import { ReportingWindowCalculator } from "@app/util/period/ReportingWindowCalculator.ts";
import { ReportingWindowFormatter } from "@app/util/period/ReportingWindowFormatter.ts";
import { RepositoryNameResolver } from "@app/util/routing/RepositoryNameResolver.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { SchemaIdentifiers } from "@app/util/seo/SchemaIdentifiers.ts";
import { SentenceListFormatter } from "@app/util/text/SentenceListFormatter.ts";
import { OrdinalIndexFormatter } from "@app/util/text/OrdinalIndexFormatter.ts";
import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import { SoftwareReleaseSchemaBuilder } from "@app/util/seo/software/SoftwareReleaseSchemaBuilder.ts";
import { SoftwareSourceCodeSchemaBuilder } from "@app/util/seo/software/SoftwareSourceCodeSchemaBuilder.ts";
import { SystemClock } from "@app/util/datetime/SystemClock.ts";
import { TechArticleSchemaBuilder } from "@app/util/seo/article/TechArticleSchemaBuilder.ts";
import { TitleFormatter } from "@app/util/text/TitleFormatter.ts";
import { TrendMarkerCalculator } from "@app/util/chart/TrendMarkerCalculator.ts";
import { TrendPlotCalculator } from "@app/util/chart/TrendPlotCalculator.ts";
import { ViewTransitionName } from "@app/util/routing/ViewTransitionName.ts";
import { WebAddressFormatter } from "@app/util/text/WebAddressFormatter.ts";
import { WebPageSchemaBuilder } from "@app/util/seo/page/WebPageSchemaBuilder.ts";
import { WebSiteSchemaBuilder } from "@app/util/seo/site/WebSiteSchemaBuilder.ts";
import { WordCounter } from "@app/util/text/WordCounter.ts";

export const bindUtil = (registry: InstanceFactoryRegistry, resolver: InstanceResolver): void => {
    registry.bind(BlogPostingSchemaBuilder, () => new BlogPostingSchemaBuilder(resolver.resolve(PersonSchemaBuilder)));
    registry.bind(BreadcrumbListSchemaBuilder, () => new BreadcrumbListSchemaBuilder());
    registry.bind(BreadcrumbStepsFactory, () => new BreadcrumbStepsFactory());
    registry.bind(BreadcrumbTrailResolver, () => new BreadcrumbTrailResolver());
    registry.bind(
        ChartPointsFactory,
        () => new ChartPointsFactory(resolver.resolve(DatetimeFormatter), resolver.resolve(MonthEndCalculator))
    );
    registry.bind(
        CollectionPageSchemaBuilder,
        () => new CollectionPageSchemaBuilder(resolver.resolve(PersonSchemaBuilder))
    );
    registry.bind(CommitMessage, () => new CommitMessage());
    registry.bind(CommitShaFormatter, () => new CommitShaFormatter());
    registry.bind(CountFormatter, () => new CountFormatter());
    registry.bind(DatetimeFormatter, () => new DatetimeFormatter());
    registry.bind(DisplayDatetimeResolver, () => new DisplayDatetimeResolver());
    registry.bind(KeywordNameFormatter, () => new KeywordNameFormatter());
    registry.bind(LanguageColorResolver, () => new LanguageColorResolver());
    registry.bind(LastCompleteMonthResolver, () => new LastCompleteMonthResolver(resolver.resolve(MonthEndCalculator)));
    registry.bind(ListFormatter, () => new ListFormatter());
    registry.bind(MarkdownLinkFormatter, () => new MarkdownLinkFormatter());
    registry.bind(MonotoneCurveCalculator, () => new MonotoneCurveCalculator());
    registry.bind(MonthEndCalculator, () => new MonthEndCalculator());
    registry.bind(MonthGroupFactory, () => new MonthGroupFactory());
    registry.bind(MonthGrouper, () => new MonthGrouper(resolver.resolve(MonthGroupFactory)));
    registry.bind(NearestNameResolver, () => new NearestNameResolver());
    registry.bind(NumberFormatter, () => new NumberFormatter());
    registry.bind(PageBreadcrumbsResolver, () => new PageBreadcrumbsResolver());
    registry.bind(PageTitleFormatter, () => new PageTitleFormatter());
    registry.bind(PersonSchemaBuilder, () => new PersonSchemaBuilder());
    registry.bind(ProfilePageSchemaBuilder, () => new ProfilePageSchemaBuilder());
    registry.bind(ReportingPeriods, () => new ReportingPeriods());
    registry.bind(ReportingWindowCalculator, () => new ReportingWindowCalculator(resolver.resolve(ReportingPeriods)));
    registry.bind(ReportingWindowFormatter, () => new ReportingWindowFormatter(resolver.resolve(DatetimeFormatter)));
    registry.bind(RepositoryNameResolver, () => new RepositoryNameResolver());
    registry.bind(RoutePathResolver, () => new RoutePathResolver());
    registry.bind(SchemaIdentifiers, () => new SchemaIdentifiers());
    registry.bind(SentenceListFormatter, () => new SentenceListFormatter());
    registry.bind(OrdinalIndexFormatter, () => new OrdinalIndexFormatter());
    registry.bind(SlugFormatter, () => new SlugFormatter());
    registry.bind(
        SoftwareReleaseSchemaBuilder,
        () => new SoftwareReleaseSchemaBuilder(resolver.resolve(PersonSchemaBuilder))
    );
    registry.bind(
        SoftwareSourceCodeSchemaBuilder,
        () => new SoftwareSourceCodeSchemaBuilder(resolver.resolve(PersonSchemaBuilder))
    );
    registry.bind(SystemClock, () => new SystemClock());
    registry.bind(TechArticleSchemaBuilder, () => new TechArticleSchemaBuilder(resolver.resolve(PersonSchemaBuilder)));
    registry.bind(TitleFormatter, () => new TitleFormatter());
    registry.bind(TrendMarkerCalculator, () => new TrendMarkerCalculator());
    registry.bind(TrendPlotCalculator, () => new TrendPlotCalculator(resolver.resolve(MonotoneCurveCalculator)));
    registry.bind(ViewTransitionName, () => new ViewTransitionName(resolver.resolve(SlugFormatter)));
    registry.bind(WebAddressFormatter, () => new WebAddressFormatter());
    registry.bind(WebPageSchemaBuilder, () => new WebPageSchemaBuilder(resolver.resolve(PersonSchemaBuilder)));
    registry.bind(WebSiteSchemaBuilder, () => new WebSiteSchemaBuilder());
    registry.bind(WordCounter, () => new WordCounter());
};
