import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { GithubRepositoryDataRetrievalService } from "@app/infrastructure/api/github/repository/data/GithubRepositoryDataRetrievalService";
import type { NpmDownloadTotals } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotals";
import type { NpmDownloadTotalsService } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotalsService";
import { BuildAnswer } from "@app/infrastructure/common/BuildAnswer";

export class NpmDownloadTotalsRetrievalService {
    private readonly githubRepositoryDataRetrievalService: GithubRepositoryDataRetrievalService;
    private readonly npmDownloadTotalsService: NpmDownloadTotalsService;
    private readonly buildAnswer: BuildAnswer<Map<string, NpmDownloadTotals>> = new BuildAnswer();

    public constructor(
        githubRepositoryDataRetrievalService: GithubRepositoryDataRetrievalService,
        npmDownloadTotalsService: NpmDownloadTotalsService
    ) {
        this.githubRepositoryDataRetrievalService = githubRepositoryDataRetrievalService;
        this.npmDownloadTotalsService = npmDownloadTotalsService;
    }

    public async retrieve(today: Date): Promise<Map<string, NpmDownloadTotals>> {
        return this.buildAnswer.of(() => this.readTotalsByPackage(today));
    }

    private async readTotalsByPackage(today: Date): Promise<Map<string, NpmDownloadTotals>> {
        const repositories: GithubRepositoryData[] = await this.githubRepositoryDataRetrievalService.retrieve();

        const packageNames: string[] = repositories.map((repository: GithubRepositoryData) => repository.getName());

        return this.npmDownloadTotalsService.getTotalsByPackage(packageNames, today);
    }
}
