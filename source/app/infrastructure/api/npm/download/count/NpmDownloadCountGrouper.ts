import { NpmDownloadCount } from "./NpmDownloadCount.ts";

export class NpmDownloadCountGrouper {
    private readonly MONTH_LENGTH: number = 7;

    public groupByDay(npmDownloadCounts: NpmDownloadCount[]): NpmDownloadCount[] {
        return this.group(npmDownloadCounts, (npmDownloadCount: NpmDownloadCount) => npmDownloadCount.getPeriod());
    }

    public groupByMonth(npmDownloadCounts: NpmDownloadCount[]): NpmDownloadCount[] {
        return this.group(npmDownloadCounts, (npmDownloadCount: NpmDownloadCount) => {
            const period: string = npmDownloadCount.getPeriod();

            return period.slice(0, this.MONTH_LENGTH);
        });
    }

    private group(
        npmDownloadCounts: NpmDownloadCount[],
        toPeriod: (npmDownloadCount: NpmDownloadCount) => string
    ): NpmDownloadCount[] {
        const counts: Map<string, number> = new Map<string, number>();

        npmDownloadCounts.forEach((npmDownloadCount: NpmDownloadCount) => {
            const period: string = toPeriod(npmDownloadCount);

            counts.set(period, (counts.get(period) ?? 0) + npmDownloadCount.getCount());
        });

        return [...counts.entries()]
            .sort((first: [string, number], second: [string, number]) => first[0].localeCompare(second[0]))
            .map((entry: [string, number]) => new NpmDownloadCount(entry[0], entry[1]));
    }
}
