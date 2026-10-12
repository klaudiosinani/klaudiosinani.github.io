import { NpmDownloadDateRange } from "./NpmDownloadDateRange.ts";

export class NpmDownloadDateRangeFactory {
    private readonly WINDOW_IN_DAYS: number = 365;
    private readonly YEAR_IN_DAYS: number = 364;
    private readonly DAY_IN_MILLISECONDS: number = 24 * 60 * 60 * 1000;
    private readonly EPOCH: string = "2018-01-01";

    public createYear(today: Date): NpmDownloadDateRange {
        const from: Date = this.shiftDays(today, -this.YEAR_IN_DAYS);

        return new NpmDownloadDateRange(from, today);
    }

    public createHistory(today: Date): NpmDownloadDateRange[] {
        const epoch: Date = new Date(`${this.EPOCH}T00:00:00Z`);
        const npmDownloadDateRanges: NpmDownloadDateRange[] = [];

        let to: Date = today;

        while (to > epoch) {
            const start: Date = this.shiftDays(to, -this.WINDOW_IN_DAYS);
            const from: Date = start > epoch ? start : epoch;

            npmDownloadDateRanges.push(new NpmDownloadDateRange(from, to));

            to = this.shiftDays(from, -1);
        }

        return npmDownloadDateRanges;
    }

    private shiftDays(date: Date, days: number): Date {
        return new Date(date.getTime() + days * this.DAY_IN_MILLISECONDS);
    }
}
