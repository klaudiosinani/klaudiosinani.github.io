import type { RepositoryNameResolver } from "@app/util/routing/RepositoryNameResolver";
import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";

/**
 * Where the project of a press feature is read about.
 *
 * A reader who arrives at a feature is one step from the work itself, and the
 * page of the project on this site states more than GitHub does: the figures,
 * the manual and every release. The card leads there.
 *
 * A repository that the build did not read has no page of its own, so the
 * card then leads to GitHub. This is the rule the software cards follow.
 */
export class PressProjectResolver {
    private readonly repositoryNameResolver: RepositoryNameResolver;
    private readonly routePathResolver: RoutePathResolver;

    public constructor(repositoryNameResolver: RepositoryNameResolver, routePathResolver: RoutePathResolver) {
        this.repositoryNameResolver = repositoryNameResolver;
        this.routePathResolver = routePathResolver;
    }
    public resolve(repositoryUrl: string, repositories: readonly string[]): string {
        const name: string = this.repositoryNameResolver.resolve(repositoryUrl);
        const known: string | undefined = repositories.find((repository: string) => repository.toLowerCase() === name);

        return known ? this.routePathResolver.resolveRepository(known) : repositoryUrl;
    }
}
