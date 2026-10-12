export class PublicationEntry {
    private readonly title: string;
    private readonly note: string;
    private readonly href: string;
    private readonly year: number;
    private readonly kind: string;

    public constructor(title: string, note: string, href: string, year: number, kind: string) {
        this.title = title;
        this.note = note;
        this.href = href;
        this.year = year;
        this.kind = kind;
    }

    public getTitle(): string {
        return this.title;
    }

    public getNote(): string {
        return this.note;
    }

    public getHref(): string {
        return this.href;
    }

    public getYear(): number {
        return this.year;
    }

    public getKind(): string {
        return this.kind;
    }
}
