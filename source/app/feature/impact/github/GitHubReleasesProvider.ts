import type { GithubReleaseEndpointAssembler } from "@app/infrastructure/api/github/release/GithubReleaseEndpointAssembler";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import type { GithubApiService } from "@app/infrastructure/api/github/common/GithubApiService";
import { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { ReleaseTotalsSource } from "./ReleaseTotalsSource";
import { ReleaseTotals } from "./ReleaseTotals";

export class GitHubReleasesProvider implements ReleaseTotalsSource {
    private readonly optionalReader: OptionalReader;
    private readonly githubApiService: GithubApiService;

    private readonly githubReleaseEndpointAssembler: GithubReleaseEndpointAssembler;
    private readonly PER_REPOSITORY: number = 100;

    public constructor(
        githubApiService: GithubApiService,
        optionalReaderFactory: OptionalReaderFactory,
        githubReleaseEndpointAssembler: GithubReleaseEndpointAssembler
    ) {
        this.githubApiService = githubApiService;
        this.optionalReader = optionalReaderFactory.create("GitHub");
        this.githubReleaseEndpointAssembler = githubReleaseEndpointAssembler;
    }

    public async releases(username: string, repositories: string[]): Promise<ReleaseTotals> {
        const gathered: (null | { published_at: string | null; assets?: { download_count: number }[] }[])[] =
            await Promise.all(
                repositories.map((name: string) =>
                    this.optionalReader.read<
                        {
                            published_at: string | null;
                            assets?: { download_count: number }[];
                        }[]
                    >(`the releases of ${name}`, () =>
                        this.githubApiService.getResource(
                            this.githubReleaseEndpointAssembler.assemble(new GithubRepositoryRef(username, name)),
                            { per_page: this.PER_REPOSITORY },
                            {}
                        )
                    )
                )
            );

        return gathered.flat().reduce<ReleaseTotals>(
            (
                totals: ReleaseTotals,
                release: {
                    published_at: string | null;
                    assets?: { download_count: number }[];
                } | null
            ) =>
                new ReleaseTotals(
                    totals.getDownloads() +
                        (release?.assets ?? []).reduce(
                            (sum: number, asset: { download_count: number }) => sum + asset.download_count,
                            0
                        ),
                    release?.published_at ? [...totals.getPublishedAt(), release.published_at] : totals.getPublishedAt()
                ),
            new ReleaseTotals(0, [])
        );
    }
}
