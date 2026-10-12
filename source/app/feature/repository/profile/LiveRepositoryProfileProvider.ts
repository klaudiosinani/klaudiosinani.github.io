import type { RepositoryManualRenderer } from "@app/feature/repository/document/RepositoryManualRenderer";
import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { DependentsSource } from "../signal/DependentsSource";
import type { PackageListingSource } from "../package/PackageListingSource";
import type { RepositoryCommitSource } from "../commit/RepositoryCommitSource";
import type { RepositoryDetailSource } from "./RepositoryDetailSource";
import type { RepositoryDocumentsSource } from "../document/RepositoryDocumentsSource";
import type { RepositoryDownloadsSource } from "../download/RepositoryDownloadsSource";
import type { RepositoryReadmeSource } from "../document/RepositoryReadmeSource";
import type { RepositoryReleaseSource } from "../release/RepositoryReleaseSource";
import type { RepositoryTotalsSource } from "../signal/RepositoryTotalsSource";
import type { RepositoryTrafficSource } from "../signal/RepositoryTrafficSource";
import type { RepositoryDownloadRecord } from "../download/RepositoryDownloadRecord";
import type { RepositoryProfile } from "./RepositoryProfile";
import type { RepositoryProfileProvider } from "./RepositoryProfileProvider";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";

export class LiveRepositoryProfileProvider implements RepositoryProfileProvider {
    private readonly repositories: RetrievalService<GithubRepositoryData>;
    private readonly counts: RepositoryTotalsSource;
    private readonly commits: RepositoryCommitSource;
    private readonly packages: PackageListingSource;
    private readonly details: RepositoryDetailSource;
    private readonly dependents: DependentsSource;
    private readonly traffic: RepositoryTrafficSource;
    private readonly readme: RepositoryReadmeSource;
    private readonly downloads: RepositoryDownloadsSource;
    private readonly documents: RepositoryDocumentsSource;
    private readonly releases: RepositoryReleaseSource;
    private readonly repositoryManualRenderer: RepositoryManualRenderer;

    public constructor(
        repositories: RetrievalService<GithubRepositoryData>,
        counts: RepositoryTotalsSource,
        commits: RepositoryCommitSource,
        packages: PackageListingSource,
        details: RepositoryDetailSource,
        dependents: DependentsSource,
        traffic: RepositoryTrafficSource,
        readme: RepositoryReadmeSource,
        downloads: RepositoryDownloadsSource,
        documents: RepositoryDocumentsSource,
        releases: RepositoryReleaseSource,
        repositoryManualRenderer: RepositoryManualRenderer
    ) {
        this.repositories = repositories;
        this.counts = counts;
        this.commits = commits;
        this.packages = packages;
        this.details = details;
        this.dependents = dependents;
        this.traffic = traffic;
        this.readme = readme;
        this.downloads = downloads;
        this.documents = documents;
        this.releases = releases;
        this.repositoryManualRenderer = repositoryManualRenderer;
    }

    public async provide(repository: GithubRepositoryRef): Promise<RepositoryProfile | null> {
        const listed: GithubRepositoryData | undefined = (await this.repositories.retrieve()).find(
            (candidate: GithubRepositoryData) =>
                candidate.getName().toLowerCase() === repository.getSlug().toLowerCase()
        );

        if (!listed) {
            return null;
        }

        const [
            releases,
            totals,
            latestCommit,
            packages,
            languages,
            contributors,
            citation,
            dependents,
            clones,
            readme,
            documents,
        ] = await Promise.all([
            this.releases.all(repository),
            this.counts.of(repository),
            this.commits.latest(repository),
            this.packages.listings(repository.getSlug()),
            this.details.languages(repository),
            this.details.contributors(repository),
            this.details.citation(repository),
            this.dependents.counts(repository),
            this.traffic.clones(repository),
            this.readme.markdown(repository),
            this.documents.documents(repository),
        ]);

        const downloaded: RepositoryDownloadRecord = await this.downloads.record(
            repository.getSlug(),
            packages,
            releases
        );

        return {
            slug: repository.getSlug(),
            name: listed.getName(),
            logline: listed.getDescription(),
            description: listed.getDescription(),
            url: listed.getUrl(),
            language: listed.getLanguage(),
            license: listed.getLicense(),
            topics: listed.getTopics(),
            createdAt: listed.getCreatedAt(),
            stars: listed.getStars(),
            forks: listed.getForks(),
            downloads: downloaded.getCounted(),
            trend: downloaded.getTrend(),
            lastPublishedDay: downloaded.getLastPublishedDay(),
            releases,
            totals,
            packages,
            latestCommit,
            languages,
            contributors,
            clones,
            dependents,
            citation,
            manual: readme ? await this.repositoryManualRenderer.render(readme, listed.getUrl()) : null,
            documents,
        };
    }
}
