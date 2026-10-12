import type { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import type { InstanceResolver } from "@app/injection/InstanceResolver.ts";
import {
    ACTIVITY_DATASET_RETRIEVAL_SERVICE,
    REPOSITORY_PROFILE_RETRIEVAL_SERVICE,
} from "@app/injection/ApplicationKeys.ts";
import { DownloadDeltaCalculator } from "@app/feature/impact/change/DownloadDeltaCalculator.ts";
import { MetricDeltaPhraser } from "@app/feature/impact/change/MetricDeltaPhraser.ts";
import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";
import { ReachConfiguration } from "@app/feature/reach/ReachConfiguration.ts";
import { DependentTotalCalculator } from "@app/feature/reach/DependentTotalCalculator.ts";
import { ProfileCollectionService } from "@app/feature/repository/profile/ProfileCollectionService.ts";
import { ReachFactory } from "@app/feature/reach/ReachFactory.ts";
import { ReachPhraser } from "@app/feature/reach/ReachPhraser.ts";
import { ReachRetrievalService } from "@app/feature/reach/ReachRetrievalService.ts";
import { ReachSignalLinesFactory } from "@app/feature/reach/signal/ReachSignalLinesFactory.ts";
import { RepositoryReachRetrievalService } from "@app/feature/reach/surface/RepositoryReachRetrievalService.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { SurfaceReachFactory } from "@app/feature/reach/surface/SurfaceReachFactory.ts";

export const bindReach = (registry: InstanceFactoryRegistry, resolver: InstanceResolver): void => {
    registry.bind(MetricDeltaPhraser, () => new MetricDeltaPhraser());
    registry.bind(ReachConfiguration, () => new ReachConfiguration());
    registry.bind(ReachFactory, () => new ReachFactory(resolver.resolve(DownloadDeltaCalculator)));
    registry.bind(DependentTotalCalculator, () => new DependentTotalCalculator());
    registry.bind(
        ReachRetrievalService,
        () =>
            new ReachRetrievalService(
                resolver.resolve(ACTIVITY_DATASET_RETRIEVAL_SERVICE),
                resolver.resolve(ProfileCollectionService),
                resolver.resolve(DependentTotalCalculator),
                resolver.resolve(ReachFactory)
            )
    );
    registry.bind(
        ReachPhraser,
        () =>
            new ReachPhraser(
                resolver.resolve(NumberFormatter),
                resolver.resolve(MetricDeltaPhraser),
                resolver.resolve(ReachConfiguration)
            )
    );
    registry.bind(ReachSignalLinesFactory, () => new ReachSignalLinesFactory(resolver.resolve(ReachPhraser)));
    registry.bind(SurfaceReachFactory, () => new SurfaceReachFactory());
    registry.bind(
        RepositoryReachRetrievalService,
        () =>
            new RepositoryReachRetrievalService(
                resolver.resolve(REPOSITORY_PROFILE_RETRIEVAL_SERVICE),
                resolver.resolve(SurfaceReachFactory),
                resolver.resolve(RoutePathResolver)
            )
    );
};
