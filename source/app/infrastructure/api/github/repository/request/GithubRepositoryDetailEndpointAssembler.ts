import type { GithubRepositoryRef } from "./GithubRepositoryRef.ts";

export class GithubRepositoryDetailEndpointAssembler {
    public assembleLanguages(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/languages`;
    }

    public assembleContributors(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/contributors?per_page=1`;
    }
}
