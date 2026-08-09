import type { RetrievalService } from "../RetrievalService";
import { RepositoryDataProviderFactory } from "./RepositoryDataProviderFactory";
import { GITHUB_USERNAME } from "@config/site";
import type { RepositoryData } from "./RepositoryData";
import type { RepositoryDataProvider } from "./RepositoryDataProvider";

export class RepositoryDataRetrievalService implements RetrievalService<RepositoryData> {
  private readonly provider: RepositoryDataProvider;
  private readonly username: string;
  private pending?: Promise<RepositoryData[]>;

  constructor(username?: string, provider?: RepositoryDataProvider) {
    this.username = username || GITHUB_USERNAME;
    this.provider = provider || RepositoryDataProviderFactory.create();
  }

  public async retrieve(): Promise<RepositoryData[]> {
    this.pending ??= this.provider
      .provide(this.username)
      .catch((error: unknown) => {
        this.pending = undefined;
        throw error;
      });

    return this.pending;
  }
}
