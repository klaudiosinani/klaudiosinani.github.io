import type { PublishedReleaseResolver } from "@app/feature/repository/release/PublishedReleaseResolver";
import type { ReleaseSlugFormatter } from "@app/feature/repository/release/ReleaseSlugFormatter";
import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import type { RepositoryRelease } from "./RepositoryRelease";

export class ReleaseAddressResolver {
    private readonly publishedReleaseResolver: PublishedReleaseResolver;
    private readonly releaseSlugFormatter: ReleaseSlugFormatter;
    private readonly routePathResolver: RoutePathResolver;

    public constructor(
        publishedReleaseResolver: PublishedReleaseResolver,
        releaseSlugFormatter: ReleaseSlugFormatter,
        routePathResolver: RoutePathResolver
    ) {
        this.publishedReleaseResolver = publishedReleaseResolver;
        this.releaseSlugFormatter = releaseSlugFormatter;
        this.routePathResolver = routePathResolver;
    }
    public of(slug: string, release: RepositoryRelease): string {
        return this.routePathResolver.resolveRelease(slug, this.releaseSlugFormatter.format(release.getTag()));
    }

    public published(slug: string, release: RepositoryRelease): string | null {
        return this.publishedReleaseResolver.publishes(release) ? this.of(slug, release) : null;
    }
}
