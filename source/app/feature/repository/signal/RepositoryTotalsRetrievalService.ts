import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RepositoryTotalsSource } from "./RepositoryTotalsSource";
import { BuildAnswer } from "@app/infrastructure/common/BuildAnswer";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";
import type { GithubRepositoryTotalsService } from "./GithubRepositoryTotalsService";
import type { RepositoryTotals } from "./RepositoryTotals";

export class RepositoryTotalsRetrievalService implements RepositoryTotalsSource {
    private readonly repositories: RetrievalService<GithubRepositoryData>;
    private readonly githubRepositoryTotalsService: GithubRepositoryTotalsService;
    private readonly answer: BuildAnswer<Map<string, RepositoryTotals>> = new BuildAnswer();

    public constructor(
        repositories: RetrievalService<GithubRepositoryData>,
        githubRepositoryTotalsService: GithubRepositoryTotalsService
    ) {
        this.repositories = repositories;
        this.githubRepositoryTotalsService = githubRepositoryTotalsService;
    }

    public async of(repository: GithubRepositoryRef): Promise<RepositoryTotals | null> {
        const totals: Map<string, RepositoryTotals> = await this.answer.of(() => this.gather(repository.getOwner()));

        return totals.get(repository.getSlug()) ?? null;
    }

    private async gather(username: string): Promise<Map<string, RepositoryTotals>> {
        const repositories: GithubRepositoryData[] = await this.repositories.retrieve();

        return this.githubRepositoryTotalsService.totals(
            username,
            repositories.map((githubRepositoryData: GithubRepositoryData) => githubRepositoryData.getName())
        );
    }
}
