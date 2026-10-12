import type { DependentCounts } from "@app/feature/repository/signal/DependentCounts";
import type { PackageListing } from "@app/feature/repository/package/PackageListing";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";
import { RepositoryDownloads } from "@app/feature/repository/download/RepositoryDownloads";

export class RepositoryProfileFixture {
    public create(
        downloads: number | null,
        dependents: DependentCounts | null,
        packages: readonly PackageListing[]
    ): RepositoryProfile {
        return {
            slug: "signale",
            name: "signale",
            logline: "Highly configurable logging library",
            description: "Highly configurable logging library",
            url: "https://github.com/klaudiosinani/signale",
            language: "JavaScript",
            license: "MIT",
            topics: [],
            createdAt: "2018-01-01T00:00:00Z",
            stars: 9_175,
            forks: 231,
            downloads: new RepositoryDownloads(downloads, [], []),
            trend: [],
            lastPublishedDay: null,
            releases: [],
            totals: null,
            packages: [...packages],
            latestCommit: null,
            languages: [],
            contributors: null,
            clones: null,
            dependents,
            citation: null,
            manual: null,
            documents: [],
        };
    }
}
