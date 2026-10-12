import type { NpmDownloadCount } from "./NpmDownloadCount.ts";

export class NpmDownloadPublicationTrimmer {
    private readonly MONTH_LENGTH: number = 7;
    private readonly DAY_OF_MONTH_LENGTH: number = 2;

    public trimDays(npmDownloadCounts: NpmDownloadCount[]): NpmDownloadCount[] {
        let end: number = npmDownloadCounts.length;

        while (end > 0 && npmDownloadCounts[end - 1].getCount() === 0) {
            end = end - 1;
        }

        return npmDownloadCounts.slice(0, end);
    }

    public resolveLastPublishedDay(npmDownloadCounts: NpmDownloadCount[]): string | null {
        const published: NpmDownloadCount[] = this.trimDays(npmDownloadCounts);

        if (published.length === 0) {
            return null;
        }

        return published[published.length - 1].getPeriod();
    }

    public trimRunningMonth(
        npmDownloadCounts: NpmDownloadCount[],
        lastPublishedDay: string | null
    ): NpmDownloadCount[] {
        if (!lastPublishedDay || npmDownloadCounts.length === 0) {
            return npmDownloadCounts;
        }

        const last: NpmDownloadCount = npmDownloadCounts[npmDownloadCounts.length - 1];

        if (this.isMonthComplete(last.getPeriod(), lastPublishedDay)) {
            return npmDownloadCounts;
        }

        return npmDownloadCounts.slice(0, -1);
    }

    private isMonthComplete(period: string, lastPublishedDay: string): boolean {
        const year: number = Number(period.slice(0, 4));
        const month: number = Number(period.slice(5, this.MONTH_LENGTH));
        const lastDayOfMonth: number = new Date(Date.UTC(year, month, 0)).getUTCDate();
        const lastDate: string = String(lastDayOfMonth).padStart(this.DAY_OF_MONTH_LENGTH, "0");

        return lastPublishedDay >= `${period}-${lastDate}`;
    }
}
