import { BuildAnswer } from "../../../../common/BuildAnswer.ts";
import type { GithubPagination } from "../../common/GithubPagination.ts";
import type { GithubRepositoryApiService } from "../GithubRepositoryApiService.ts";
import type { GithubRepositoryData } from "./GithubRepositoryData.ts";
import type { RetrievalService } from "../../../../common/RetrievalService.ts";

export class GithubRepositoryDataRetrievalService implements RetrievalService<GithubRepositoryData> {
    private readonly githubRepositoryApiService: GithubRepositoryApiService;
    private readonly githubPagination: GithubPagination;
    private readonly username: string;
    private readonly buildAnswer: BuildAnswer<GithubRepositoryData[]> = new BuildAnswer();

    public constructor(
        githubRepositoryApiService: GithubRepositoryApiService,
        githubPagination: GithubPagination,
        username: string
    ) {
        this.githubRepositoryApiService = githubRepositoryApiService;
        this.githubPagination = githubPagination;
        this.username = username;
    }

    public async retrieve(): Promise<GithubRepositoryData[]> {
        return this.buildAnswer.of(() =>
            this.githubRepositoryApiService.getRepositories(this.username, this.githubPagination)
        );
    }
}
