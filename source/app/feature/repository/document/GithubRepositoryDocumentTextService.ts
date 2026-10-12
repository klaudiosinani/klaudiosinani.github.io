import type { GithubContentEndpointAssembler } from "@app/infrastructure/api/github/content/GithubContentEndpointAssembler";
import type { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader";
import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryDocumentTextProvider } from "./RepositoryDocumentTextProvider";

export class GithubRepositoryDocumentTextService implements RepositoryDocumentTextProvider {
    private readonly githubOptionalReader: GithubOptionalReader;
    private readonly githubContentEndpointAssembler: GithubContentEndpointAssembler;

    public constructor(
        githubOptionalReader: GithubOptionalReader,
        githubContentEndpointAssembler: GithubContentEndpointAssembler
    ) {
        this.githubOptionalReader = githubOptionalReader;
        this.githubContentEndpointAssembler = githubContentEndpointAssembler;
    }

    public async markdown(repository: GithubRepositoryRef, path: string): Promise<string | null> {
        return this.githubOptionalReader.readText(
            this.githubContentEndpointAssembler.assembleContents(repository, path)
        );
    }
}
