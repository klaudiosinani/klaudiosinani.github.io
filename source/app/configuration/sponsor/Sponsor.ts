export class Sponsor {
    private readonly name: string;
    private readonly href: string;
    private readonly mark: string;
    private readonly website: string;
    private readonly current: boolean;
    private readonly featured: boolean;

    public constructor(name: string, href: string, mark: string, website: string, current: boolean, featured: boolean) {
        this.name = name;
        this.href = href;
        this.mark = mark;
        this.website = website;
        this.current = current;
        this.featured = featured;
    }

    public getName(): string {
        return this.name;
    }
    public getHref(): string {
        return this.href;
    }
    public getMark(): string {
        return this.mark;
    }
    public getWebsite(): string {
        return this.website;
    }
    public getWebsiteHost(): string {
        return new URL(this.website).host;
    }
    public isCurrent(): boolean {
        return this.current;
    }
    public isFeatured(): boolean {
        return this.featured;
    }
}
