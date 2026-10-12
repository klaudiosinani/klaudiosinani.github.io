import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import type { RepositoryPageKey } from "./RepositoryPageKey";
import { RepositoryPage } from "./RepositoryPage";
import type { RepositoryProfile } from "../profile/RepositoryProfile";

export class RepositoryPageNavigationFactory {
    private readonly routePathResolver: RoutePathResolver;

    public constructor(routePathResolver: RoutePathResolver) {
        this.routePathResolver = routePathResolver;
    }
    public create(profile: RepositoryProfile, current: RepositoryPageKey): RepositoryPage[] {
        const repositoryPages: RepositoryPage[] = [
            new RepositoryPage(
                "activity",
                "Activity",
                this.routePathResolver.resolveRepository(profile.slug),
                current === "activity"
            ),
        ];

        if (profile.manual) {
            repositoryPages.push(
                new RepositoryPage(
                    "documentation",
                    "Documentation",
                    this.routePathResolver.resolveRepositoryManual(profile.slug),
                    current === "documentation"
                )
            );
        }

        if (profile.releases.length > 0) {
            repositoryPages.push(
                new RepositoryPage(
                    "releases",
                    "Releases",
                    this.routePathResolver.resolveRepositoryReleases(profile.slug),
                    current === "releases"
                )
            );
        }

        return repositoryPages;
    }
}
