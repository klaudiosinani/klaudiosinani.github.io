import type { CountedDownloadSource } from "./CountedDownloadSource";

export class RepositoryDownloads {
    private readonly total: number | null;
    private readonly sources: readonly CountedDownloadSource[];
    private readonly caveats: readonly string[];

    public constructor(total: number | null, sources: readonly CountedDownloadSource[], caveats: readonly string[]) {
        this.total = total;
        this.sources = sources;
        this.caveats = caveats;
    }

    public getTotal(): number | null {
        return this.total;
    }

    public getSources(): readonly CountedDownloadSource[] {
        return this.sources;
    }

    public getCaveats(): readonly string[] {
        return this.caveats;
    }

    public isCounted(): boolean {
        return this.total !== null;
    }
}
