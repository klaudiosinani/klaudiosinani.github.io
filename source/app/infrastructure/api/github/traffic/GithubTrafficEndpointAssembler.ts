import type { GithubRepositoryRef } from "../repository/request/GithubRepositoryRef.ts";

export class GithubTrafficEndpointAssembler {
    public assembleViews(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/traffic/views`;
    }

    public assembleClones(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/traffic/clones`;
    }
}
