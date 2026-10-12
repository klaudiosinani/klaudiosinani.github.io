import type { RepositoryDownloads } from "./RepositoryDownloads";

export class RepositoryDownloadRecord {
    private readonly counted: RepositoryDownloads;
    private readonly trend: number[];
    private readonly lastPublishedDay: string | null;

    public constructor(counted: RepositoryDownloads, trend: number[], lastPublishedDay: string | null) {
        this.counted = counted;
        this.trend = trend;
        this.lastPublishedDay = lastPublishedDay;
    }

    public getCounted(): RepositoryDownloads {
        return this.counted;
    }
    public getTrend(): number[] {
        return this.trend;
    }
    public getLastPublishedDay(): string | null {
        return this.lastPublishedDay;
    }
}
