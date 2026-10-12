export class ExperienceLink {
    private readonly href: string;
    private readonly label: string;

    public constructor(href: string, label: string) {
        this.href = href;
        this.label = label;
    }

    public getHref(): string {
        return this.href;
    }
    public getLabel(): string {
        return this.label;
    }
}
