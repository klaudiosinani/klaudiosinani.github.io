export class ReleaseData {
    private readonly repository: string;
    private readonly tag: string;
    private readonly name: string;
    private readonly url: string;
    private readonly publishedAt: string;

    public constructor(repository: string, tag: string, name: string, url: string, publishedAt: string) {
        this.repository = repository;
        this.tag = tag;
        this.name = name;
        this.url = url;
        this.publishedAt = publishedAt;
    }

    public getRepository(): string {
        return this.repository;
    }
    public getTag(): string {
        return this.tag;
    }
    public getName(): string {
        return this.name;
    }
    public getUrl(): string {
        return this.url;
    }
    public getPublishedAt(): string {
        return this.publishedAt;
    }
}
