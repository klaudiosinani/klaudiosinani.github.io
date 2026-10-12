import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import type { RepositoryFacts } from "@app/feature/repository/profile/RepositoryFacts";
import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import { RepositoryOgDetails } from "@app/infrastructure/render/og/details/RepositoryOgDetails";
import { RepositoryOgFigure } from "@app/infrastructure/render/og/details/RepositoryOgFigure";
import type { CardedRepository } from "../profile/CardedRepository";
import { SITE } from "@app/configuration/site/Site";

export class RepositoryOgDetailsResolver {
    private readonly numberFormatter: NumberFormatter;
    private readonly repositoryFacts: RepositoryFacts;
    private readonly routePathResolver: RoutePathResolver;
    private readonly FIGURES: number = 3;
    private readonly FEWEST_DEPENDENTS: number = 1000;

    public constructor(
        numberFormatter: NumberFormatter,
        repositoryFacts: RepositoryFacts,
        routePathResolver: RoutePathResolver
    ) {
        this.numberFormatter = numberFormatter;
        this.repositoryFacts = repositoryFacts;
        this.routePathResolver = routePathResolver;
    }

    public resolve(profile: CardedRepository): RepositoryOgDetails {
        return new RepositoryOgDetails(
            profile.name,
            profile.logline,
            this.repositoryFacts.newestTag(profile),
            this.address(profile.slug),
            this.figures(profile)
        );
    }

    private figures(profile: CardedRepository): RepositoryOgFigure[] {
        const counted: (RepositoryOgFigure | false | null)[] = [
            this.repositoryFacts.hasDownloads(profile) &&
                new RepositoryOgFigure(this.numberFormatter.display(profile.downloads.getTotal() ?? 0), "Downloads"),
            profile.stars > 0 && new RepositoryOgFigure(this.numberFormatter.display(profile.stars), "Stars"),
            profile.dependents !== null &&
                profile.dependents.getRepositories() >= this.FEWEST_DEPENDENTS &&
                new RepositoryOgFigure(
                    this.numberFormatter.display(profile.dependents.getRepositories()),
                    "Dependents"
                ),
            profile.contributors !== null &&
                profile.contributors > 1 &&
                new RepositoryOgFigure(this.numberFormatter.display(profile.contributors), "Contributors"),
            profile.forks > 0 && new RepositoryOgFigure(this.numberFormatter.display(profile.forks), "Forks"),
        ];

        return counted
            .filter((figure: false | RepositoryOgFigure | null): figure is RepositoryOgFigure => Boolean(figure))
            .slice(0, this.FIGURES);
    }

    private address(slug: string): string {
        return `${new URL(SITE.getWebsite()).hostname}${this.routePathResolver.resolveRepository(slug)}`;
    }
}
