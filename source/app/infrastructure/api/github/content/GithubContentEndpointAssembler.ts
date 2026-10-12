import type { GithubRepositoryRef } from "../repository/request/GithubRepositoryRef.ts";

export class GithubContentEndpointAssembler {
    public assembleReadme(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/readme`;
    }

    public assembleContents(githubRepositoryRef: GithubRepositoryRef, path: string): string {
        return `repos/${githubRepositoryRef.getPath()}/contents/${path}`;
    }

    public assembleCitation(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/contents/CITATION.cff`;
    }

    public assembleTree(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/git/trees/HEAD?recursive=1`;
    }
}
