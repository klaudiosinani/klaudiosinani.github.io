import type { GithubApiService } from "../common/GithubApiService.ts";
import type { GithubPagination } from "../common/GithubPagination.ts";
import type { GithubRepositoryData } from "./data/GithubRepositoryData.ts";
import type { GithubRepositoryDataMapper } from "./data/GithubRepositoryDataMapper.ts";
import type { GithubRepositoryDto } from "./response/GithubRepositoryDto.ts";
import type { GithubRepositoryDtoAssembler } from "./response/GithubRepositoryDtoAssembler.ts";
import type { GithubRepositoryEndpointAssembler } from "./request/GithubRepositoryEndpointAssembler.ts";

export class GithubRepositoryApiService {
    private readonly githubApiService: GithubApiService;
    private readonly githubRepositoryEndpointAssembler: GithubRepositoryEndpointAssembler;
    private readonly githubRepositoryDataMapper: GithubRepositoryDataMapper;
    private readonly githubRepositoryDtoAssembler: GithubRepositoryDtoAssembler;

    public constructor(
        githubApiService: GithubApiService,
        githubRepositoryEndpointAssembler: GithubRepositoryEndpointAssembler,
        githubRepositoryDataMapper: GithubRepositoryDataMapper,
        githubRepositoryDtoAssembler: GithubRepositoryDtoAssembler
    ) {
        this.githubApiService = githubApiService;
        this.githubRepositoryEndpointAssembler = githubRepositoryEndpointAssembler;
        this.githubRepositoryDataMapper = githubRepositoryDataMapper;
        this.githubRepositoryDtoAssembler = githubRepositoryDtoAssembler;
    }

    public async getRepositories(
        username: string,
        githubPagination: GithubPagination
    ): Promise<GithubRepositoryData[]> {
        const endpoint: string = this.githubRepositoryEndpointAssembler.assemble(username);
        const payloads: unknown[] = await this.githubApiService.getEntries<unknown>(endpoint, {}, githubPagination, {});

        const githubRepositoryDtos: GithubRepositoryDto[] = payloads.map((payload: unknown) =>
            this.githubRepositoryDtoAssembler.assemble(payload)
        );

        const sortedGithubRepositoryDtos: GithubRepositoryDto[] = this.sort(githubRepositoryDtos);

        return sortedGithubRepositoryDtos.map((githubRepositoryDto: GithubRepositoryDto) =>
            this.githubRepositoryDataMapper.map(githubRepositoryDto)
        );
    }

    private sort(githubRepositoryDtos: GithubRepositoryDto[]): GithubRepositoryDto[] {
        return [...githubRepositoryDtos].sort(
            (first: GithubRepositoryDto, second: GithubRepositoryDto) =>
                second.getStargazersCount() - first.getStargazersCount() ||
                first.getName().localeCompare(second.getName())
        );
    }
}
