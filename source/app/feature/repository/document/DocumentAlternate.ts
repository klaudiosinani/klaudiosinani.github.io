export class DocumentAlternate {
    private readonly tag: string;
    private readonly name: string;
    private readonly href: string;
    private readonly current: boolean;

    public constructor(tag: string, name: string, href: string, current: boolean) {
        this.tag = tag;
        this.name = name;
        this.href = href;
        this.current = current;
    }

    public getTag(): string {
        return this.tag;
    }
    public getName(): string {
        return this.name;
    }
    public getHref(): string {
        return this.href;
    }
    public isCurrent(): boolean {
        return this.current;
    }
}
