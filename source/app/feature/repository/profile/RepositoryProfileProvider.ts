import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryProfile } from "./RepositoryProfile";

export interface RepositoryProfileProvider {
    provide(repository: GithubRepositoryRef): Promise<RepositoryProfile | null>;
}
