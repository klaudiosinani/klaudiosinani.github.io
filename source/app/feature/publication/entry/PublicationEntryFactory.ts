import type { CollectionEntry } from "astro:content";
import type { PublicationKindResolver } from "./PublicationKindResolver";
import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import { PublicationEntry } from "./PublicationEntry";

export class PublicationEntryFactory {
    private readonly publicationKindResolver: PublicationKindResolver;
    private readonly routePathResolver: RoutePathResolver;

    public constructor(publicationKindResolver: PublicationKindResolver, routePathResolver: RoutePathResolver) {
        this.publicationKindResolver = publicationKindResolver;
        this.routePathResolver = routePathResolver;
    }

    public create(publication: CollectionEntry<"blog">): PublicationEntry {
        return new PublicationEntry(
            publication.data.title,
            publication.data.description,
            this.routePathResolver.resolvePublication(publication.id),
            publication.data.pubDatetime.getUTCFullYear(),
            this.publicationKindResolver.resolve(publication.data.tags)
        );
    }
}
