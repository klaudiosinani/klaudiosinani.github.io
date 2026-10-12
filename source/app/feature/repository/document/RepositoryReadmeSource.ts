import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";

export interface RepositoryReadmeSource {
    markdown(repository: GithubRepositoryRef): Promise<string | null>;
}
