import type { RepositoryConfiguration } from "@app/feature/repository/profile/RepositoryConfiguration";
import type { RepositoryProfileResolver } from "@app/feature/repository/profile/RepositoryProfileResolver";
import type { RepositoryProfileRetrievalService } from "@app/feature/repository/profile/RepositoryProfileRetrievalService";
import type { FeaturedSoftware } from "@app/feature/software/featured/FeaturedSoftware";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { RepositoryProfile } from "./RepositoryProfile";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";

export class ProfileCollectionService {
    private readonly repositories: RetrievalService<GithubRepositoryData>;
    private readonly curated: RetrievalService<FeaturedSoftware>;
    private readonly repositoryConfiguration: RepositoryConfiguration;
    private readonly repositoryProfileResolver: RepositoryProfileResolver;
    private readonly repositoryProfileRetrievalService: RepositoryProfileRetrievalService;

    public constructor(
        repositories: RetrievalService<GithubRepositoryData>,
        curated: RetrievalService<FeaturedSoftware>,
        repositoryConfiguration: RepositoryConfiguration,
        repositoryProfileResolver: RepositoryProfileResolver,
        repositoryProfileRetrievalService: RepositoryProfileRetrievalService
    ) {
        this.repositories = repositories;
        this.curated = curated;
        this.repositoryConfiguration = repositoryConfiguration;
        this.repositoryProfileResolver = repositoryProfileResolver;
        this.repositoryProfileRetrievalService = repositoryProfileRetrievalService;
    }

    public async retrieve(): Promise<RepositoryProfile[]> {
        const [repositories, featured] = await Promise.all([this.repositories.retrieve(), this.curated.retrieve()]);

        const profiled: GithubRepositoryData[] = repositories.filter((githubRepositoryData: GithubRepositoryData) =>
            this.repositoryConfiguration.profiles(githubRepositoryData.getName())
        );

        const gathered: (RepositoryProfile | null)[] = await Promise.all(
            profiled.map((githubRepositoryData: GithubRepositoryData) =>
                this.repositoryProfileRetrievalService.retrieve(githubRepositoryData.getName())
            )
        );

        return gathered
            .filter((profile: RepositoryProfile | null): profile is RepositoryProfile => profile !== null)
            .map((profile: RepositoryProfile) => this.repositoryProfileResolver.resolve(profile, featured));
    }
}
