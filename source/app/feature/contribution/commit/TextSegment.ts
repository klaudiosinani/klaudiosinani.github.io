export class TextSegment {
    private readonly text: string;
    private readonly code: boolean;

    public constructor(text: string, code: boolean) {
        this.text = text;
        this.code = code;
    }

    public getText(): string {
        return this.text;
    }
    public isCode(): boolean {
        return this.code;
    }
}
