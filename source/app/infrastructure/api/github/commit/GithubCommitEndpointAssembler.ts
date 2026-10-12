import type { GithubRepositoryRef } from "../repository/request/GithubRepositoryRef.ts";

export class GithubCommitEndpointAssembler {
    public assemble(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/commits`;
    }

    public assembleLatest(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/commits?per_page=1`;
    }

    public assembleCheckRuns(githubRepositoryRef: GithubRepositoryRef, sha: string): string {
        return `repos/${githubRepositoryRef.getPath()}/commits/${sha}/check-runs`;
    }
}
