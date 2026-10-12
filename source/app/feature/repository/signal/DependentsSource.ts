import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { DependentCounts } from "./DependentCounts";

export interface DependentsSource {
    counts(repository: GithubRepositoryRef): Promise<DependentCounts | null>;
}
