export class RegistryProfile {
    private readonly name: string;
    private readonly href: string;
    private readonly title: string;

    public constructor(name: string, href: string, title: string) {
        this.name = name;
        this.href = href;
        this.title = title;
    }

    public getName(): string {
        return this.name;
    }
    public getHref(): string {
        return this.href;
    }
    public getTitle(): string {
        return this.title;
    }
}
