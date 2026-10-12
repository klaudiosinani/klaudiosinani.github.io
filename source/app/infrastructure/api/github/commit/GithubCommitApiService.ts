import type { GithubApiService } from "../common/GithubApiService.ts";
import type { GithubPagination } from "../common/GithubPagination.ts";
import type { GithubRepositoryRef } from "../repository/request/GithubRepositoryRef.ts";
import type { GithubAuthoredCommit } from "./GithubAuthoredCommit.ts";
import type { GithubAuthoredCommitMapper } from "./GithubAuthoredCommitMapper.ts";
import type { GithubCommitEndpointAssembler } from "./GithubCommitEndpointAssembler.ts";
import type { GithubCommitDto } from "./GithubCommitDto.ts";
import type { GithubCommitDtoAssembler } from "./GithubCommitDtoAssembler.ts";

export class GithubCommitApiService {
    private readonly githubApiService: GithubApiService;
    private readonly githubCommitEndpointAssembler: GithubCommitEndpointAssembler;
    private readonly githubAuthoredCommitMapper: GithubAuthoredCommitMapper;
    private readonly githubCommitDtoAssembler: GithubCommitDtoAssembler;

    public constructor(
        githubApiService: GithubApiService,
        githubCommitEndpointAssembler: GithubCommitEndpointAssembler,
        githubAuthoredCommitMapper: GithubAuthoredCommitMapper,
        githubCommitDtoAssembler: GithubCommitDtoAssembler
    ) {
        this.githubApiService = githubApiService;
        this.githubCommitEndpointAssembler = githubCommitEndpointAssembler;
        this.githubAuthoredCommitMapper = githubAuthoredCommitMapper;
        this.githubCommitDtoAssembler = githubCommitDtoAssembler;
    }

    public async getAuthoredCommits(
        githubRepositoryRef: GithubRepositoryRef,
        author: string,
        githubPagination: GithubPagination
    ): Promise<GithubAuthoredCommit[]> {
        const endpoint: string = this.githubCommitEndpointAssembler.assemble(githubRepositoryRef);

        const payloads: unknown[] = await this.githubApiService.getEntries<unknown>(
            endpoint,
            { author },
            githubPagination,
            {}
        );

        const githubCommitDtos: GithubCommitDto[] = payloads.map((payload: unknown) =>
            this.githubCommitDtoAssembler.assemble(payload)
        );

        return githubCommitDtos.map((githubCommitDto: GithubCommitDto) =>
            this.githubAuthoredCommitMapper.map(githubCommitDto)
        );
    }
}
