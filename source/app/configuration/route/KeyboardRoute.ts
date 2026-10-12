export class KeyboardRoute {
    private readonly key: string;
    private readonly label: string;
    private readonly href: string;

    public constructor(key: string, label: string, href: string) {
        this.key = key;
        this.label = label;
        this.href = href;
    }

    public getKey(): string {
        return this.key;
    }
    public getLabel(): string {
        return this.label;
    }
    public getHref(): string {
        return this.href;
    }
}
