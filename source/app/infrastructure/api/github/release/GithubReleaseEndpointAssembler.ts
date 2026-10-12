import type { GithubRepositoryRef } from "../repository/request/GithubRepositoryRef.ts";

export class GithubReleaseEndpointAssembler {
    public assemble(githubRepositoryRef: GithubRepositoryRef): string {
        return `repos/${githubRepositoryRef.getPath()}/releases`;
    }

    public assemblePaged(githubRepositoryRef: GithubRepositoryRef, entriesPerPage: number): string {
        return `repos/${githubRepositoryRef.getPath()}/releases?per_page=${entriesPerPage}`;
    }
}
