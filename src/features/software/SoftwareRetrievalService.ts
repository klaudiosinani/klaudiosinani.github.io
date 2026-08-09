import type { RetrievalService } from "@services/RetrievalService";
import { SITE } from "@config/site";
import { RepositoryDataRetrievalService } from "@services/github/RepositoryDataRetrievalService";
import type { Software } from "./Software";
import type { RepositoryData } from "@services/github/RepositoryData";

export class SoftwareRetrievalService implements RetrievalService<Software> {
  private repositoryDataRetrievalService: RepositoryDataRetrievalService;

  constructor(repositoryDataRetrievalService?: RepositoryDataRetrievalService) {
    this.repositoryDataRetrievalService =
      repositoryDataRetrievalService || new RepositoryDataRetrievalService();
  }

  public async retrieve(): Promise<Software[]> {
    const repositories: RepositoryData[] =
      await this.repositoryDataRetrievalService.retrieve();

    return repositories.map(repository => ({
      name: repository.name,
      description: repository.description || "",
      repositoryUrl: repository.url,
      homepageUrl: new URL(repository.name, SITE.website).href,
      stars: repository.stars,
      forks: repository.forks,
      language: repository.language,
      latestUpdate: repository.latestUpdate,
    }));
  }
}

export const softwareRetrievalService = new SoftwareRetrievalService();
