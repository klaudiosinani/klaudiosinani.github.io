export class ContributedRepository {
    private readonly owner: string;
    private readonly name: string;
    private readonly title: string;
    private readonly url: string;
    private readonly summary: string;
    private readonly role: string;

    public constructor(owner: string, name: string, title: string, url: string, summary: string, role: string) {
        this.owner = owner;
        this.name = name;
        this.title = title;
        this.url = url;
        this.summary = summary;
        this.role = role;
    }

    public getOwner(): string {
        return this.owner;
    }
    public getName(): string {
        return this.name;
    }
    public getTitle(): string {
        return this.title;
    }
    public getUrl(): string {
        return this.url;
    }
    public getSummary(): string {
        return this.summary;
    }
    public getRole(): string {
        return this.role;
    }
}
