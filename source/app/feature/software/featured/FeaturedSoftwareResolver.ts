import type { RepositoryNameResolver } from "@app/util/routing/RepositoryNameResolver";
import type { TitleFormatter } from "@app/util/text/TitleFormatter";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { FeaturedSoftware } from "./FeaturedSoftware";
import type { FeaturedSoftwareEntry } from "./FeaturedSoftwareEntry";
import type { FeaturedSoftwareEntryFactory } from "./FeaturedSoftwareEntryFactory";
import type { SoftwareSignals } from "../signal/SoftwareSignals";
import type { SoftwareSignalsFactory } from "../signal/SoftwareSignalsFactory";

export class FeaturedSoftwareResolver {
    private readonly repositoryNameResolver: RepositoryNameResolver;
    private readonly titleFormatter: TitleFormatter;
    private readonly featuredSoftwareEntryFactory: FeaturedSoftwareEntryFactory;
    private readonly softwareSignalsFactory: SoftwareSignalsFactory;

    public constructor(
        repositoryNameResolver: RepositoryNameResolver,
        titleFormatter: TitleFormatter,
        featuredSoftwareEntryFactory: FeaturedSoftwareEntryFactory,
        softwareSignalsFactory: SoftwareSignalsFactory
    ) {
        this.repositoryNameResolver = repositoryNameResolver;
        this.titleFormatter = titleFormatter;
        this.featuredSoftwareEntryFactory = featuredSoftwareEntryFactory;
        this.softwareSignalsFactory = softwareSignalsFactory;
    }

    public fromRepositories(
        repositories: readonly GithubRepositoryData[],
        featured: readonly FeaturedSoftware[],
        signals: ReadonlyMap<string, SoftwareSignals>
    ): FeaturedSoftwareEntry[] {
        const curated: Map<string, FeaturedSoftware> = new Map(
            featured.map((featuredSoftware: FeaturedSoftware) => [
                this.repositoryNameResolver.resolve(featuredSoftware.url),
                featuredSoftware,
            ])
        );

        return repositories.map((githubRepositoryData: GithubRepositoryData) => {
            const featuredSoftware: FeaturedSoftware | undefined = curated.get(
                githubRepositoryData.getName().toLowerCase()
            );

            return this.featuredSoftwareEntryFactory.create(
                featuredSoftware?.name ?? this.titleFormatter.format(githubRepositoryData.getName()),
                featuredSoftware?.logline ?? githubRepositoryData.getDescription(),
                featuredSoftware?.description ?? githubRepositoryData.getDescription(),
                githubRepositoryData.getUrl(),
                featuredSoftware?.order ?? Number.MAX_SAFE_INTEGER,
                featuredSoftware?.seoTitle,
                githubRepositoryData.getStars(),
                githubRepositoryData.getForks(),
                githubRepositoryData.getLanguage(),
                githubRepositoryData.getName(),
                this.signalsOf(signals.get(githubRepositoryData.getName()), githubRepositoryData.getLanguage())
            );
        });
    }

    public resolve(
        featured: readonly FeaturedSoftware[],
        repositories: readonly GithubRepositoryData[],
        signals: ReadonlyMap<string, SoftwareSignals>
    ): FeaturedSoftwareEntry[] {
        const known: Map<string, GithubRepositoryData> = new Map(
            repositories.map((githubRepositoryData: GithubRepositoryData) => [
                githubRepositoryData.getName().toLowerCase(),
                githubRepositoryData,
            ])
        );

        return featured.map((featuredSoftware: FeaturedSoftware) => {
            const githubRepositoryData: GithubRepositoryData | undefined = known.get(
                this.repositoryNameResolver.resolve(featuredSoftware.url)
            );

            return this.featuredSoftwareEntryFactory.createCurated(
                featuredSoftware,
                githubRepositoryData?.getStars() ?? null,
                githubRepositoryData?.getForks() ?? null,
                githubRepositoryData?.getLanguage() ?? null,
                githubRepositoryData?.getName() ?? null,
                this.signalsOf(
                    githubRepositoryData ? signals.get(githubRepositoryData.getName()) : undefined,
                    githubRepositoryData?.getLanguage() ?? null
                )
            );
        });
    }

    private signalsOf(softwareSignals: SoftwareSignals | undefined, language: string | null): SoftwareSignals {
        return softwareSignals ?? this.softwareSignalsFactory.createAbsent(language);
    }
}
