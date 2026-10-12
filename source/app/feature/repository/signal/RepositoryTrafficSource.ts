import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";

export interface RepositoryTrafficSource {
    clones(repository: GithubRepositoryRef): Promise<number | null>;
}
