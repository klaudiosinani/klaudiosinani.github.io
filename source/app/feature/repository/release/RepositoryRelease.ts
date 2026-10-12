export class RepositoryRelease {
    private readonly tag: string;
    private readonly name: string;
    private readonly publishedAt: string;
    private readonly notes: string;
    private readonly url: string;
    private readonly downloads: number;

    public constructor(tag: string, name: string, publishedAt: string, notes: string, url: string, downloads: number) {
        this.tag = tag;
        this.name = name;
        this.publishedAt = publishedAt;
        this.notes = notes;
        this.url = url;
        this.downloads = downloads;
    }

    public getTag(): string {
        return this.tag;
    }
    public getName(): string {
        return this.name;
    }
    public getPublishedAt(): string {
        return this.publishedAt;
    }
    public getNotes(): string {
        return this.notes;
    }
    public getUrl(): string {
        return this.url;
    }
    public getDownloads(): number {
        return this.downloads;
    }
}
