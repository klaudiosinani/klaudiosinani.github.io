import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryCitation } from "./RepositoryCitation";
import type { RepositoryLanguage } from "./RepositoryLanguage";

export interface RepositoryDetailSource {
    languages(repository: GithubRepositoryRef): Promise<RepositoryLanguage[]>;
    contributors(repository: GithubRepositoryRef): Promise<number | null>;
    citation(repository: GithubRepositoryRef): Promise<RepositoryCitation | null>;
}
