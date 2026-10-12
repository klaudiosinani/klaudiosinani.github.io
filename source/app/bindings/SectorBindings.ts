import type { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import type { InstanceResolver } from "@app/injection/InstanceResolver.ts";
import { RETRIEVAL_SERVICE_FEATURED_SOFTWARE } from "@app/injection/ApplicationKeys.ts";
import { PublicationEntryFactory } from "@app/feature/publication/entry/PublicationEntryFactory.ts";
import { PublicationKindResolver } from "@app/feature/publication/entry/PublicationKindResolver.ts";
import { RepositoryNameResolver } from "@app/util/routing/RepositoryNameResolver.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import { SoftwareSlugRetrievalService } from "@app/feature/software/sector/SoftwareSlugRetrievalService.ts";
import { SurfaceReachRanker } from "@app/feature/reach/surface/SurfaceReachRanker.ts";

export const bindSector = (registry: InstanceFactoryRegistry, resolver: InstanceResolver): void => {
    registry.bind(
        SoftwareSlugRetrievalService,
        () =>
            new SoftwareSlugRetrievalService(
                resolver.resolve(RETRIEVAL_SERVICE_FEATURED_SOFTWARE),
                resolver.resolve(RepositoryNameResolver)
            )
    );
    registry.bind(SurfaceReachRanker, () => new SurfaceReachRanker());
    registry.bind(PublicationKindResolver, () => new PublicationKindResolver(resolver.resolve(SlugFormatter)));
    registry.bind(
        PublicationEntryFactory,
        () =>
            new PublicationEntryFactory(resolver.resolve(PublicationKindResolver), resolver.resolve(RoutePathResolver))
    );
};
