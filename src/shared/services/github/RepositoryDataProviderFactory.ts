import { GitHubRepositoryDataProvider } from "./GitHubRepositoryDataProvider";
import { MockRepositoryDataProvider } from "./MockRepositoryDataProvider";
import type { RepositoryDataProvider } from "./RepositoryDataProvider";

export class RepositoryDataProviderFactory {
  static create(
    isProduction: boolean = import.meta.env.PROD
  ): RepositoryDataProvider {
    if (isProduction) {
      return new GitHubRepositoryDataProvider();
    }

    return new MockRepositoryDataProvider();
  }
}
