export class SearchSegment {
    private readonly text: string;
    private readonly matched: boolean;

    public constructor(text: string, matched: boolean) {
        this.text = text;
        this.matched = matched;
    }

    public getText(): string {
        return this.text;
    }
    public isMatched(): boolean {
        return this.matched;
    }
}
