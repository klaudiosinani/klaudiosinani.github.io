import { GitHubRepositoryDataProvider } from "providers/GithubRepositoryDataProvider";
import { MockRepositoryDataProvider } from "providers/MockRepositoryDataProvider";
import type { RepositoryDataProvider } from "providers/RepositoryProvider";

export class RepositoryDataServiceFactory {
  static create(
    env: string = process.env.NODE_ENV || "development"
  ): RepositoryDataProvider {
    if (env === "development" || env === "test") {
      return new MockRepositoryDataProvider();
    }

    return new GitHubRepositoryDataProvider();
  }
}
