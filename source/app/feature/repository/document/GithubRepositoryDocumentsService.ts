import type { GithubContentEndpointAssembler } from "@app/infrastructure/api/github/content/GithubContentEndpointAssembler";
import type { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader";
import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryDocument } from "./RepositoryDocument";
import type { RepositoryDocumentsFactory } from "./RepositoryDocumentsFactory";
import type { RepositoryDocumentsSource } from "./RepositoryDocumentsSource";

export class GithubRepositoryDocumentsService implements RepositoryDocumentsSource {
    private readonly MARKDOWN: RegExp = /\.md$/i;

    private readonly githubOptionalReader: GithubOptionalReader;
    private readonly githubContentEndpointAssembler: GithubContentEndpointAssembler;
    private readonly repositoryDocumentsFactory: RepositoryDocumentsFactory;

    public constructor(
        githubOptionalReader: GithubOptionalReader,
        githubContentEndpointAssembler: GithubContentEndpointAssembler,
        repositoryDocumentsFactory: RepositoryDocumentsFactory
    ) {
        this.githubOptionalReader = githubOptionalReader;
        this.githubContentEndpointAssembler = githubContentEndpointAssembler;
        this.repositoryDocumentsFactory = repositoryDocumentsFactory;
    }

    public async documents(repository: GithubRepositoryRef): Promise<RepositoryDocument[]> {
        const tree: { tree?: { path: string; type: string }[] } | null = await this.githubOptionalReader.readResource<{
            tree?: { path: string; type: string }[];
        }>(this.githubContentEndpointAssembler.assembleTree(repository), {});

        const paths: string[] = (tree?.tree ?? [])
            .filter(({ path, type }: { path: string; type: string }) => type === "blob" && this.MARKDOWN.test(path))
            .map(({ path }: { path: string; type: string }) => path);

        return this.repositoryDocumentsFactory.create(paths);
    }
}
