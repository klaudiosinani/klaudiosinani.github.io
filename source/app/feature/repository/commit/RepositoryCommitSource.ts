import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryCommit } from "./RepositoryCommit";

export interface RepositoryCommitSource {
    latest(repository: GithubRepositoryRef): Promise<RepositoryCommit | null>;
}
