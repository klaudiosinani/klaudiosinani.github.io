export class PageOgDetails {
    private readonly title: string;
    private readonly description: string;
    private readonly address: string;

    public constructor(title: string, description: string, address: string) {
        this.title = title;
        this.description = description;
        this.address = address;
    }

    public getTitle(): string {
        return this.title;
    }
    public getDescription(): string {
        return this.description;
    }
    public getAddress(): string {
        return this.address;
    }
}
