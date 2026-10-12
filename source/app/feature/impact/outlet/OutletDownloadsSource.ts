import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { OutletDownloads } from "./OutletDownloads";

export interface OutletDownloadsSource {
    downloads(repositories: GithubRepositoryData[]): Promise<OutletDownloads>;
}
