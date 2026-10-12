import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { TrafficMetrics } from "../metric/TrafficMetrics";

export interface TrafficSource {
    traffic(username: string, repositories: GithubRepositoryData[]): Promise<TrafficMetrics | null>;
}
