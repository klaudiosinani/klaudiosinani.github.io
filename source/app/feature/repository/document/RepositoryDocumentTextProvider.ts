import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";

export interface RepositoryDocumentTextProvider {
    markdown(repository: GithubRepositoryRef, path: string): Promise<string | null>;
}
