import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryTotals } from "./RepositoryTotals";

export interface RepositoryTotalsSource {
    of(repository: GithubRepositoryRef): Promise<RepositoryTotals | null>;
}
