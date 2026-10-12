import type { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader";
import type { GithubReleaseDto } from "@app/infrastructure/api/github/release/GithubReleaseDto";
import type { GithubReleaseDtoAssembler } from "@app/infrastructure/api/github/release/GithubReleaseDtoAssembler";
import type { GithubReleaseEndpointAssembler } from "@app/infrastructure/api/github/release/GithubReleaseEndpointAssembler";
import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import { RepositoryRelease } from "./RepositoryRelease";
import type { RepositoryReleaseSource } from "./RepositoryReleaseSource";

export class GithubRepositoryReleaseService implements RepositoryReleaseSource {
    private readonly RELEASES_PER_PAGE: number = 100;

    private readonly githubOptionalReader: GithubOptionalReader;
    private readonly githubReleaseEndpointAssembler: GithubReleaseEndpointAssembler;
    private readonly githubReleaseDtoAssembler: GithubReleaseDtoAssembler;

    public constructor(
        githubOptionalReader: GithubOptionalReader,
        githubReleaseEndpointAssembler: GithubReleaseEndpointAssembler,
        githubReleaseDtoAssembler: GithubReleaseDtoAssembler
    ) {
        this.githubOptionalReader = githubOptionalReader;
        this.githubReleaseEndpointAssembler = githubReleaseEndpointAssembler;
        this.githubReleaseDtoAssembler = githubReleaseDtoAssembler;
    }

    public async all(repository: GithubRepositoryRef): Promise<RepositoryRelease[]> {
        const payload: unknown[] | null = await this.githubOptionalReader.readResource<unknown[]>(
            this.githubReleaseEndpointAssembler.assemblePaged(repository, this.RELEASES_PER_PAGE),
            {}
        );

        return (payload ?? [])
            .map((entry: unknown) => this.githubReleaseDtoAssembler.assemble(entry))
            .filter((release: GithubReleaseDto) => release.isPublished())
            .map((release: GithubReleaseDto) => this.release(release))
            .sort(
                (first: RepositoryRelease, second: RepositoryRelease) =>
                    Date.parse(second.getPublishedAt()) - Date.parse(first.getPublishedAt())
            );
    }

    private release(release: GithubReleaseDto): RepositoryRelease {
        return new RepositoryRelease(
            release.getTagName(),
            release.getName()?.trim() || release.getTagName(),
            release.getPublishedAt() ?? "",
            release.getBody()?.trim() ?? "",
            release.getHtmlUrl(),
            release.getAssetDownloadCounts().reduce((total: number, downloadCount: number) => total + downloadCount, 0)
        );
    }
}
