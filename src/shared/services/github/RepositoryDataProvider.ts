import type { RepositoryData } from "./RepositoryData";

export interface RepositoryDataProvider {
  provide(username: string): Promise<RepositoryData[]>;
}
