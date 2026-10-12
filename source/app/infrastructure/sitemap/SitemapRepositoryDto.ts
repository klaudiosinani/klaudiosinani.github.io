export class SitemapRepositoryDto {
    private readonly name: string;
    private readonly pushedAt: string;

    public constructor(name: string, pushedAt: string) {
        this.name = name;
        this.pushedAt = pushedAt;
    }

    public getName(): string {
        return this.name;
    }

    public getPushedAt(): string {
        return this.pushedAt;
    }
}
