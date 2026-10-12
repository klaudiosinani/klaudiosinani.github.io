export class NpmDownloadCount {
    private readonly period: string;
    private readonly count: number;

    public constructor(period: string, count: number) {
        this.period = period;
        this.count = count;
    }

    public getPeriod(): string {
        return this.period;
    }

    public getCount(): number {
        return this.count;
    }
}
