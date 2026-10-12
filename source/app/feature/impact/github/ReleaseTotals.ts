export class ReleaseTotals {
    private readonly downloads: number;
    private readonly publishedAt: string[];

    public constructor(downloads: number, publishedAt: string[]) {
        this.downloads = downloads;
        this.publishedAt = publishedAt;
    }

    public getDownloads(): number {
        return this.downloads;
    }
    public getPublishedAt(): string[] {
        return this.publishedAt;
    }
}
