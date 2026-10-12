import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryDocument } from "./RepositoryDocument";

export interface RepositoryDocumentsSource {
    documents(repository: GithubRepositoryRef): Promise<RepositoryDocument[]>;
}
