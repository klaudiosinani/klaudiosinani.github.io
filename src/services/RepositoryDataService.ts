import { RepositoryDataServiceFactory } from "factory/RepositoryDataServiceFactory";
import { MockRepositoryDataProvider } from "providers/MockRepositoryDataProvider";
import { GITHUB_USERNAME } from "@config";
import type { RepositoryData } from "providers/RepositoryData";
import type { RepositoryDataProvider } from "providers/RepositoryProvider";

export class RepositoryDataService {
  private readonly provider: RepositoryDataProvider;
  private readonly username: string;

  constructor(username?: string, provider?: RepositoryDataProvider) {
    this.username = username || GITHUB_USERNAME;
    this.provider = provider || RepositoryDataServiceFactory.create();
  }

  async fetchRepositories(): Promise<RepositoryData[]> {
    try {
      return await this.provider.fetchRepositories(this.username);
    } catch (error) {
      if (import.meta.env.PROD) {
        console.error("FATAL: Failed to fetch repository data:", error);
        process.exit(1);
      }

      console.error("Error fetching repositories:", error);

      const mockProvider = new MockRepositoryDataProvider();
      return await mockProvider.fetchRepositories(this.username);
    }
  }
}
