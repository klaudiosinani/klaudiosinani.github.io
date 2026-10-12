import type { RepositoryDownloads } from "../download/RepositoryDownloads";
import type { RepositoryRelease } from "../release/RepositoryRelease";

interface Released {
    readonly releases: readonly RepositoryRelease[];
}

interface Counted {
    readonly downloads: RepositoryDownloads;
}

export class RepositoryFacts {
    public newestTag({ releases }: Released): string | null {
        return releases[0]?.getTag() ?? null;
    }

    public hasDownloads(repository: Counted): boolean {
        return repository.downloads.isCounted();
    }
}
