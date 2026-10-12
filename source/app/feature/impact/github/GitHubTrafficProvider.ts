import type { GithubAccessToken } from "@app/infrastructure/api/github/common/GithubAccessToken";
import type { GithubTrafficEndpointAssembler } from "@app/infrastructure/api/github/traffic/GithubTrafficEndpointAssembler";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import type { GithubApiService } from "@app/infrastructure/api/github/common/GithubApiService";
import { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { TrafficSource } from "./TrafficSource";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import { TrafficMetrics } from "../metric/TrafficMetrics";

export class GitHubTrafficProvider implements TrafficSource {
    private readonly optionalReader: OptionalReader;
    private readonly githubApiService: GithubApiService;

    private readonly githubTrafficEndpointAssembler: GithubTrafficEndpointAssembler;
    private readonly githubAccessToken: GithubAccessToken;
    public constructor(
        githubApiService: GithubApiService,
        optionalReaderFactory: OptionalReaderFactory,
        githubTrafficEndpointAssembler: GithubTrafficEndpointAssembler,
        githubAccessToken: GithubAccessToken
    ) {
        this.githubApiService = githubApiService;
        this.optionalReader = optionalReaderFactory.create("GitHub");
        this.githubTrafficEndpointAssembler = githubTrafficEndpointAssembler;
        this.githubAccessToken = githubAccessToken;
    }

    public async traffic(username: string, repositories: GithubRepositoryData[]): Promise<TrafficMetrics | null> {
        if (!this.githubAccessToken.hasTrafficToken()) {
            return null;
        }

        const gathered: (TrafficMetrics | null)[] = await Promise.all(
            repositories.map((githubRepositoryData: GithubRepositoryData) =>
                this.forRepository(new GithubRepositoryRef(username, githubRepositoryData.getName()))
            )
        );

        const answered: TrafficMetrics[] = gathered.filter(
            (trafficMetrics: TrafficMetrics | null): trafficMetrics is TrafficMetrics => trafficMetrics !== null
        );

        if (answered.length === 0) {
            return null;
        }

        return answered.reduce(
            (total: TrafficMetrics, entry: TrafficMetrics) =>
                new TrafficMetrics(
                    total.getViews() + entry.getViews(),
                    total.getUniqueVisitors() + entry.getUniqueVisitors(),
                    total.getClones() + entry.getClones()
                ),
            new TrafficMetrics(0, 0, 0)
        );
    }

    private async forRepository(repository: GithubRepositoryRef): Promise<TrafficMetrics | null> {
        const [views, clones] = await Promise.all([
            this.optionalReader.read<{ count: number; uniques: number }>(`the views of ${repository.getPath()}`, () =>
                this.githubApiService.getResource(this.githubTrafficEndpointAssembler.assembleViews(repository), {}, {})
            ),
            this.optionalReader.read<{ count: number }>(`the clones of ${repository.getPath()}`, () =>
                this.githubApiService.getResource(
                    this.githubTrafficEndpointAssembler.assembleClones(repository),
                    {},
                    {}
                )
            ),
        ]);

        if (views === null && clones === null) {
            return null;
        }

        return new TrafficMetrics(views?.count ?? 0, views?.uniques ?? 0, clones?.count ?? 0);
    }
}
