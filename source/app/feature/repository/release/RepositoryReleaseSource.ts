import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryRelease } from "./RepositoryRelease";

export interface RepositoryReleaseSource {
    all(repository: GithubRepositoryRef): Promise<RepositoryRelease[]>;
}
