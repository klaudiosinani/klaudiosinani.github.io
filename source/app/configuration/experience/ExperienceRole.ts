export class ExperienceRole {
    private readonly title: string;
    private readonly from: string;
    private readonly to: string | null;
    private readonly summary: string | undefined;

    public constructor(title: string, from: string, to: string | null, summary: string | undefined) {
        this.title = title;
        this.from = from;
        this.to = to;
        this.summary = summary;
    }

    public getTitle(): string {
        return this.title;
    }
    public getFrom(): string {
        return this.from;
    }
    public getTo(): string | null {
        return this.to;
    }
    public getSummary(): string | undefined {
        return this.summary;
    }
}
