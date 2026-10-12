export class Tag {
    private readonly tag: string;
    private readonly tagName: string;
    private readonly count: number;

    public constructor(tag: string, tagName: string, count: number) {
        this.tag = tag;
        this.tagName = tagName;
        this.count = count;
    }

    public getTag(): string {
        return this.tag;
    }
    public getTagName(): string {
        return this.tagName;
    }
    public getCount(): number {
        return this.count;
    }
}
