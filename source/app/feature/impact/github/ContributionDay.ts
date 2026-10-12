export class ContributionDay {
    private readonly date: string;
    private readonly count: number;

    public constructor(date: string, count: number) {
        this.date = date;
        this.count = count;
    }

    public getDate(): string {
        return this.date;
    }
    public getCount(): number {
        return this.count;
    }
}
