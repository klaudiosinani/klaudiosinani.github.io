import type { RepositoryData } from "./RepositoryData";

export interface RepositoryDataProvider {
  fetchRepositories(username: string): Promise<RepositoryData[]>;
}
