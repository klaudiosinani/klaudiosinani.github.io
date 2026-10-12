import type { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import type { InstanceResolver } from "@app/injection/InstanceResolver.ts";
import { REPOSITORY_PROFILE_RETRIEVAL_SERVICE } from "@app/injection/ApplicationKeys.ts";
import { PartnerConfiguration } from "@app/feature/partner/PartnerConfiguration.ts";
import { PartnerRetrievalService } from "@app/feature/partner/PartnerRetrievalService.ts";
import { PartnerSignalLinesFactory } from "@app/feature/partner/signal/PartnerSignalLinesFactory.ts";
import { PlacementsFactory } from "@app/feature/partner/placement/PlacementsFactory.ts";
import { SurfaceReachFactory } from "@app/feature/reach/surface/SurfaceReachFactory.ts";
import { ReachPhraser } from "@app/feature/reach/ReachPhraser.ts";
import { ReachRetrievalService } from "@app/feature/reach/ReachRetrievalService.ts";

export const bindPartner = (registry: InstanceFactoryRegistry, resolver: InstanceResolver): void => {
    registry.bind(PartnerConfiguration, () => new PartnerConfiguration());
    registry.bind(
        PlacementsFactory,
        () => new PlacementsFactory(resolver.resolve(PartnerConfiguration), resolver.resolve(SurfaceReachFactory))
    );
    registry.bind(
        PartnerRetrievalService,
        () =>
            new PartnerRetrievalService(
                resolver.resolve(ReachRetrievalService),
                resolver.resolve(REPOSITORY_PROFILE_RETRIEVAL_SERVICE),
                resolver.resolve(PlacementsFactory),
                resolver.resolve(PartnerConfiguration)
            )
    );
    registry.bind(
        PartnerSignalLinesFactory,
        () => new PartnerSignalLinesFactory(resolver.resolve(ReachPhraser), resolver.resolve(PartnerConfiguration))
    );
};
