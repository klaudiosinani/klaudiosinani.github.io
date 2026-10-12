import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";
import type { GithubRepositoryDataRetrievalService } from "@app/infrastructure/api/github/repository/data/GithubRepositoryDataRetrievalService";
import type { Software } from "./Software";
import type { SoftwareFactory } from "./SoftwareFactory";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";

export class SoftwareRetrievalService implements RetrievalService<Software> {
    private readonly repositoryDataRetrievalService: GithubRepositoryDataRetrievalService;
    private readonly softwareFactory: SoftwareFactory;

    public constructor(
        repositoryDataRetrievalService: GithubRepositoryDataRetrievalService,
        softwareFactory: SoftwareFactory
    ) {
        this.repositoryDataRetrievalService = repositoryDataRetrievalService;
        this.softwareFactory = softwareFactory;
    }

    public async retrieve(): Promise<Software[]> {
        const repositories: GithubRepositoryData[] = await this.repositoryDataRetrievalService.retrieve();

        return repositories.map((githubRepositoryData: GithubRepositoryData) =>
            this.softwareFactory.create(githubRepositoryData)
        );
    }
}
