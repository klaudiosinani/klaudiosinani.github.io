import { SITE } from "@config";
import { RepositoryDataService } from "./RepositoryDataService";
import type { Software } from "./Software";
import type { RepositoryData } from "providers/RepositoryData";

export class SoftwareRetrievalService {
  private repositoryDataService: RepositoryDataService;

  constructor(repositoryDataService?: RepositoryDataService) {
    this.repositoryDataService =
      repositoryDataService || new RepositoryDataService();
  }

  async retrieve(): Promise<Software[]> {
    const repositories: RepositoryData[] =
      await this.repositoryDataService.fetchRepositories();

    return repositories.map(repository => ({
      name: repository.name,
      description: repository.description || "",
      repositoryUrl: repository.url,
      homepageUrl: SITE.website + repository.name,
      stars: Math.round(repository.stars),
      forks: repository.forks,
      language: repository.language,
      latestUpdate: repository.latestUpdate,
    }));
  }
}

export const softwareRetrievalService = new SoftwareRetrievalService();
