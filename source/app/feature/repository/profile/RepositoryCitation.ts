export class RepositoryCitation {
    private readonly url: string;
    private readonly title: string | null;
    private readonly text: string;

    public constructor(url: string, title: string | null, text: string) {
        this.url = url;
        this.title = title;
        this.text = text;
    }

    public getUrl(): string {
        return this.url;
    }
    public getTitle(): string | null {
        return this.title;
    }
    public getText(): string {
        return this.text;
    }
}
