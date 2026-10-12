import type { DependentCounts } from "../signal/DependentCounts";
import type { RepositoryDownloads } from "../download/RepositoryDownloads";
import type { RepositoryRelease } from "../release/RepositoryRelease";

export interface CardedRepository {
    readonly name: string;
    readonly logline: string;
    readonly slug: string;
    readonly stars: number;
    readonly forks: number;
    readonly contributors: number | null;
    readonly downloads: RepositoryDownloads;
    readonly dependents: DependentCounts | null;
    readonly releases: readonly RepositoryRelease[];
}
