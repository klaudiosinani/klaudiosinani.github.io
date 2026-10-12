import type { FeaturedSoftware } from "@app/feature/software/featured/FeaturedSoftware";
import type { RepositoryNameResolver } from "@app/util/routing/RepositoryNameResolver";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";
import type { SectorKey } from "@app/configuration/sector/SectorKey";

export class SoftwareSlugRetrievalService {
    private readonly featuredSoftwareRetrievalService: RetrievalService<FeaturedSoftware>;
    private readonly repositoryNameResolver: RepositoryNameResolver;

    public constructor(
        featuredSoftwareRetrievalService: RetrievalService<FeaturedSoftware>,
        repositoryNameResolver: RepositoryNameResolver
    ) {
        this.featuredSoftwareRetrievalService = featuredSoftwareRetrievalService;
        this.repositoryNameResolver = repositoryNameResolver;
    }

    public async retrieve(sectorKey: SectorKey): Promise<string[]> {
        const featuredSoftware: FeaturedSoftware[] = await this.featuredSoftwareRetrievalService.retrieve();

        return featuredSoftware
            .filter((software: FeaturedSoftware) => software.featured && software.sector === sectorKey)
            .sort((first: FeaturedSoftware, second: FeaturedSoftware) => first.order - second.order)
            .map((software: FeaturedSoftware) => this.repositoryNameResolver.resolve(software.url));
    }
}
