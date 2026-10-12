export class SponsorLink {
    private readonly href: string;
    private readonly label: string;
    private readonly title: string;

    public constructor(href: string, label: string, title: string) {
        this.href = href;
        this.label = label;
        this.title = title;
    }

    public getHref(): string {
        return this.href;
    }
    public getLabel(): string {
        return this.label;
    }
    public getTitle(): string {
        return this.title;
    }
}
