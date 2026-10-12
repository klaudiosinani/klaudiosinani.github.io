import type { FeaturedSoftwareResolver } from "@app/feature/software/featured/FeaturedSoftwareResolver";
import type { FeaturedSoftware } from "./FeaturedSoftware";
import type { FeaturedSoftwareEntry } from "./FeaturedSoftwareEntry";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";
import type { SoftwareSignalsSource } from "../signal/SoftwareSignalsSource";

export class FeaturedSoftwareEntryRetrievalService {
    private readonly curated: RetrievalService<FeaturedSoftware>;
    private readonly repositories: RetrievalService<GithubRepositoryData>;
    private readonly source: SoftwareSignalsSource;

    private readonly featuredSoftwareResolver: FeaturedSoftwareResolver;
    public constructor(
        source: SoftwareSignalsSource,
        curated: RetrievalService<FeaturedSoftware>,
        repositories: RetrievalService<GithubRepositoryData>,
        featuredSoftwareResolver: FeaturedSoftwareResolver
    ) {
        this.source = source;
        this.curated = curated;
        this.repositories = repositories;
        this.featuredSoftwareResolver = featuredSoftwareResolver;
    }

    public async retrieve(): Promise<FeaturedSoftwareEntry[]> {
        const [curated, repositories] = await Promise.all([this.curated.retrieve(), this.repositories.retrieve()]);

        const matched: FeaturedSoftwareEntry[] = this.featuredSoftwareResolver.resolve(
            curated,
            repositories,
            new Map()
        );

        return this.featuredSoftwareResolver.resolve(
            curated,
            repositories,
            await this.source.signals(
                matched
                    .map((featuredSoftwareEntry: FeaturedSoftwareEntry) => featuredSoftwareEntry.getSlug())
                    .filter((slug: string | null): slug is string => slug !== null)
            )
        );
    }
}
