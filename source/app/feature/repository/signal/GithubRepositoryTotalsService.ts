import type { GithubAccessToken } from "@app/infrastructure/api/github/common/GithubAccessToken";
import type { GithubGraphqlEndpointAssembler } from "@app/infrastructure/api/github/common/GithubGraphqlEndpointAssembler";
import type { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader";
import type { RepositoryTotals } from "./RepositoryTotals";
import type { RepositoryTotalsNodeDto } from "./RepositoryTotalsNodeDto";
import type { RepositoryTotalsNodeDtoAssembler } from "./RepositoryTotalsNodeDtoAssembler";
import type { RepositoryTotalsQuery } from "./RepositoryTotalsQuery";

export class GithubRepositoryTotalsService {
    private readonly TOTALS_BATCH: number = 25;

    private readonly githubOptionalReader: GithubOptionalReader;
    private readonly githubGraphqlEndpointAssembler: GithubGraphqlEndpointAssembler;
    private readonly githubAccessToken: GithubAccessToken;
    private readonly repositoryTotalsQuery: RepositoryTotalsQuery;
    private readonly repositoryTotalsNodeDtoAssembler: RepositoryTotalsNodeDtoAssembler;

    public constructor(
        githubOptionalReader: GithubOptionalReader,
        githubGraphqlEndpointAssembler: GithubGraphqlEndpointAssembler,
        githubAccessToken: GithubAccessToken,
        repositoryTotalsQuery: RepositoryTotalsQuery,
        repositoryTotalsNodeDtoAssembler: RepositoryTotalsNodeDtoAssembler
    ) {
        this.githubOptionalReader = githubOptionalReader;
        this.githubGraphqlEndpointAssembler = githubGraphqlEndpointAssembler;
        this.githubAccessToken = githubAccessToken;
        this.repositoryTotalsQuery = repositoryTotalsQuery;
        this.repositoryTotalsNodeDtoAssembler = repositoryTotalsNodeDtoAssembler;
    }

    public async totals(username: string, slugs: readonly string[]): Promise<Map<string, RepositoryTotals>> {
        if (!this.githubAccessToken.getValue() || slugs.length === 0) {
            return new Map();
        }

        const batches: Map<string, RepositoryTotals>[] = await Promise.all(
            this.chunk(slugs).map((batch: string[]) => this.totalsBatch(username, batch))
        );

        return new Map(batches.flatMap((batch: Map<string, RepositoryTotals>) => [...batch]));
    }

    private async totalsBatch(username: string, slugs: readonly string[]): Promise<Map<string, RepositoryTotals>> {
        const body: { data?: Record<string, unknown> } | null = await this.githubOptionalReader.post<{
            data?: Record<string, unknown>;
        }>(this.githubGraphqlEndpointAssembler.assemble(), {
            query: this.repositoryTotalsQuery.document(username, slugs),
        });

        if (!body?.data) {
            return new Map();
        }

        const nodes: Record<string, RepositoryTotalsNodeDto | null> = {};

        for (const [alias, node] of Object.entries(body.data)) {
            nodes[alias] = node === null ? null : this.repositoryTotalsNodeDtoAssembler.assemble(node);
        }

        return this.repositoryTotalsQuery.read(slugs, nodes);
    }

    private chunk(slugs: readonly string[]): string[][] {
        const batches: string[][] = [];

        for (let start: number = 0; start < slugs.length; start += this.TOTALS_BATCH) {
            batches.push([...slugs.slice(start, start + this.TOTALS_BATCH)]);
        }

        return batches;
    }
}
