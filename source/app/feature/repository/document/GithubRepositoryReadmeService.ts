import type { GithubContentEndpointAssembler } from "@app/infrastructure/api/github/content/GithubContentEndpointAssembler";
import type { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader";
import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryReadmeSource } from "./RepositoryReadmeSource";

export class GithubRepositoryReadmeService implements RepositoryReadmeSource {
    private readonly githubOptionalReader: GithubOptionalReader;
    private readonly githubContentEndpointAssembler: GithubContentEndpointAssembler;

    public constructor(
        githubOptionalReader: GithubOptionalReader,
        githubContentEndpointAssembler: GithubContentEndpointAssembler
    ) {
        this.githubOptionalReader = githubOptionalReader;
        this.githubContentEndpointAssembler = githubContentEndpointAssembler;
    }

    public async markdown(repository: GithubRepositoryRef): Promise<string | null> {
        return this.githubOptionalReader.readText(this.githubContentEndpointAssembler.assembleReadme(repository));
    }
}
