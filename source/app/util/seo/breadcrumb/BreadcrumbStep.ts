export class BreadcrumbStep {
    private readonly name: string;
    private readonly url: string;

    public constructor(name: string, url: string) {
        this.name = name;
        this.url = url;
    }

    public getName(): string {
        return this.name;
    }
    public getUrl(): string {
        return this.url;
    }
}
