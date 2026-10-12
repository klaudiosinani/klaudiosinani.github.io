import type { GithubAccessToken } from "@app/infrastructure/api/github/common/GithubAccessToken";
import type { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader";
import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { GithubTrafficEndpointAssembler } from "@app/infrastructure/api/github/traffic/GithubTrafficEndpointAssembler";
import type { RepositoryTrafficSource } from "./RepositoryTrafficSource";

export class GithubRepositoryTrafficService implements RepositoryTrafficSource {
    private readonly githubOptionalReader: GithubOptionalReader;
    private readonly githubTrafficEndpointAssembler: GithubTrafficEndpointAssembler;
    private readonly githubAccessToken: GithubAccessToken;

    public constructor(
        githubOptionalReader: GithubOptionalReader,
        githubTrafficEndpointAssembler: GithubTrafficEndpointAssembler,
        githubAccessToken: GithubAccessToken
    ) {
        this.githubOptionalReader = githubOptionalReader;
        this.githubTrafficEndpointAssembler = githubTrafficEndpointAssembler;
        this.githubAccessToken = githubAccessToken;
    }

    public async clones(repository: GithubRepositoryRef): Promise<number | null> {
        if (!this.githubAccessToken.hasTrafficToken()) {
            return null;
        }

        const payload: { count: number } | null = await this.githubOptionalReader.readResource<{
            count: number;
        }>(this.githubTrafficEndpointAssembler.assembleClones(repository), {});

        return payload?.count ?? null;
    }
}
