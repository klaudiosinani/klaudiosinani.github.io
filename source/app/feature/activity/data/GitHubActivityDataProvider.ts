import type { GithubReleaseEndpointAssembler } from "@app/infrastructure/api/github/release/GithubReleaseEndpointAssembler";
import type { GithubCommitEndpointAssembler } from "@app/infrastructure/api/github/commit/GithubCommitEndpointAssembler";
import type { CommitMessage } from "@app/util/text/CommitMessage";
import type { ActivityConfiguration } from "@app/feature/activity/ActivityConfiguration";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import type { GithubApiService } from "@app/infrastructure/api/github/common/GithubApiService";
import { ActivityData } from "./ActivityData";
import { CommitData } from "./CommitData";
import type { GithubCommitDto } from "@app/infrastructure/api/github/commit/GithubCommitDto";
import type { GithubCommitDtoAssembler } from "@app/infrastructure/api/github/commit/GithubCommitDtoAssembler";
import type { GithubReleaseDto } from "@app/infrastructure/api/github/release/GithubReleaseDto";
import type { GithubReleaseDtoAssembler } from "@app/infrastructure/api/github/release/GithubReleaseDtoAssembler";
import { ReleaseData } from "./ReleaseData";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";

export class GitHubActivityDataProvider {
    private readonly optionalReader: OptionalReader;
    private readonly repositories: RetrievalService<GithubRepositoryData>;
    private readonly githubApiService: GithubApiService;

    private readonly githubCommitDtoAssembler: GithubCommitDtoAssembler;
    private readonly githubReleaseDtoAssembler: GithubReleaseDtoAssembler;
    private readonly commitMessage: CommitMessage;
    private readonly activityConfiguration: ActivityConfiguration;

    private readonly githubCommitEndpointAssembler: GithubCommitEndpointAssembler;
    private readonly githubReleaseEndpointAssembler: GithubReleaseEndpointAssembler;

    public constructor(
        repositories: RetrievalService<GithubRepositoryData>,
        githubApiService: GithubApiService,
        githubCommitDtoAssembler: GithubCommitDtoAssembler,
        githubReleaseDtoAssembler: GithubReleaseDtoAssembler,
        optionalReaderFactory: OptionalReaderFactory,
        commitMessage: CommitMessage,
        activityConfiguration: ActivityConfiguration,
        githubCommitEndpointAssembler: GithubCommitEndpointAssembler,
        githubReleaseEndpointAssembler: GithubReleaseEndpointAssembler
    ) {
        this.repositories = repositories;
        this.githubApiService = githubApiService;
        this.githubCommitDtoAssembler = githubCommitDtoAssembler;
        this.githubReleaseDtoAssembler = githubReleaseDtoAssembler;
        this.optionalReader = optionalReaderFactory.create("GitHub");
        this.commitMessage = commitMessage;
        this.activityConfiguration = activityConfiguration;
        this.githubCommitEndpointAssembler = githubCommitEndpointAssembler;
        this.githubReleaseEndpointAssembler = githubReleaseEndpointAssembler;
    }

    public async provide(username: string): Promise<ActivityData> {
        const covered: GithubRepositoryData[] = await this.mostRecentlyUpdated();

        const gathered: ActivityData[] = await Promise.all(
            covered.map(
                async (githubRepositoryData: GithubRepositoryData) =>
                    new ActivityData(
                        await this.commitsOf(new GithubRepositoryRef(username, githubRepositoryData.getName())),
                        await this.releasesOf(new GithubRepositoryRef(username, githubRepositoryData.getName()))
                    )
            )
        );

        return new ActivityData(
            this.newestFirst(
                gathered.flatMap((activityData: ActivityData) => activityData.getCommits()),
                (commitData: CommitData) => commitData.getCommittedAt()
            ),
            this.newestFirst(
                gathered.flatMap((activityData: ActivityData) => activityData.getReleases()),
                (releaseData: ReleaseData) => releaseData.getPublishedAt()
            )
        );
    }

    private async mostRecentlyUpdated(): Promise<GithubRepositoryData[]> {
        const repositories: GithubRepositoryData[] = await this.repositories.retrieve();

        return [...repositories]
            .sort(
                (first: GithubRepositoryData, second: GithubRepositoryData) =>
                    Date.parse(second.getLatestPush()) - Date.parse(first.getLatestPush())
            )
            .slice(0, this.activityConfiguration.getRepositoryCount());
    }

    private async commitsOf(repository: GithubRepositoryRef): Promise<CommitData[]> {
        const payloads: unknown[] = await this.request<unknown>(
            this.githubCommitEndpointAssembler.assemble(repository)
        );

        const commits: GithubCommitDto[] = payloads.map((payload: unknown) =>
            this.githubCommitDtoAssembler.assemble(payload)
        );

        return commits.map(
            (commit: GithubCommitDto) =>
                new CommitData(
                    repository.getSlug(),
                    commit.getSha(),
                    this.commitMessage.subject(commit.getMessage()),
                    commit.getHtmlUrl(),
                    commit.getAuthoredAt()
                )
        );
    }

    private async releasesOf(repository: GithubRepositoryRef): Promise<ReleaseData[]> {
        const payloads: unknown[] = await this.request<unknown>(
            this.githubReleaseEndpointAssembler.assemble(repository)
        );

        const releases: GithubReleaseDto[] = payloads.map((payload: unknown) =>
            this.githubReleaseDtoAssembler.assemble(payload)
        );

        return releases
            .filter((release: GithubReleaseDto) => release.isPublished())
            .map(
                (release: GithubReleaseDto) =>
                    new ReleaseData(
                        repository.getSlug(),
                        release.getTagName(),
                        release.getName() ?? release.getTagName(),
                        release.getHtmlUrl(),
                        release.getPublishedAt() ?? ""
                    )
            );
    }

    private async request<T>(path: string): Promise<T[]> {
        const entries: T[] | null = await this.optionalReader.read<T[]>(path, () =>
            this.githubApiService.getResource<T[]>(
                path,
                { per_page: this.activityConfiguration.getEntriesPerKindPerRepository() },
                {}
            )
        );

        return entries ?? [];
    }

    private newestFirst<T>(entries: T[], at: (entry: T) => string): T[] {
        return [...entries].sort((first: T, second: T) => Date.parse(at(second)) - Date.parse(at(first)));
    }
}
