import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import { ROUTES } from "@app/configuration/route/Routes";
import { TrailStep } from "@app/util/routing/TrailStep";

export class RepositoryTrailFactory {
    private readonly routePathResolver: RoutePathResolver;

    public constructor(routePathResolver: RoutePathResolver) {
        this.routePathResolver = routePathResolver;
    }
    public create(name: string, slug: string, ...below: readonly TrailStep[]): TrailStep[] {
        return [
            new TrailStep("Software", `${ROUTES.software}/`),
            new TrailStep(name, this.routePathResolver.resolveRepository(slug)),
            ...below,
        ];
    }
}
