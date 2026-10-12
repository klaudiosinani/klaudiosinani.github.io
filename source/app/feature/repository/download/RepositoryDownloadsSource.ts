import type { PackageListing } from "../package/PackageListing";
import type { RepositoryDownloadRecord } from "./RepositoryDownloadRecord";
import type { RepositoryRelease } from "../release/RepositoryRelease";

export interface RepositoryDownloadsSource {
    record(
        slug: string,
        packages: readonly PackageListing[],
        releases: readonly RepositoryRelease[]
    ): Promise<RepositoryDownloadRecord>;
}
