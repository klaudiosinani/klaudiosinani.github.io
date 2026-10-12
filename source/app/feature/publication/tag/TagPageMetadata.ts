export class TagPageMetadata {
    private readonly title: string;
    private readonly description: string;

    public constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }

    public getTitle(): string {
        return this.title;
    }
    public getDescription(): string {
        return this.description;
    }
}
