import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";
import type { RepositoryProfileRetrievalService } from "@app/feature/repository/profile/RepositoryProfileRetrievalService";
import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import type { SurfaceReach } from "./SurfaceReach";
import type { SurfaceReachFactory } from "./SurfaceReachFactory";

export class RepositoryReachRetrievalService {
    private readonly repositoryProfileRetrievalService: RepositoryProfileRetrievalService;
    private readonly surfaceReachFactory: SurfaceReachFactory;
    private readonly routePathResolver: RoutePathResolver;

    public constructor(
        repositoryProfileRetrievalService: RepositoryProfileRetrievalService,
        surfaceReachFactory: SurfaceReachFactory,
        routePathResolver: RoutePathResolver
    ) {
        this.repositoryProfileRetrievalService = repositoryProfileRetrievalService;
        this.surfaceReachFactory = surfaceReachFactory;
        this.routePathResolver = routePathResolver;
    }

    public async retrieve(slugs: readonly string[]): Promise<SurfaceReach[]> {
        const profiles: (RepositoryProfile | null)[] = await Promise.all(
            slugs.map((slug: string) => this.repositoryProfileRetrievalService.retrieve(slug))
        );

        return profiles
            .filter((repositoryProfile: RepositoryProfile | null): repositoryProfile is RepositoryProfile =>
                Boolean(repositoryProfile)
            )
            .map((repositoryProfile: RepositoryProfile) =>
                this.surfaceReachFactory.create(
                    repositoryProfile,
                    repositoryProfile.name,
                    repositoryProfile.logline,
                    this.routePathResolver.resolveRepository(repositoryProfile.slug)
                )
            );
    }
}
