import type { NpmDownloadDateRange } from "./NpmDownloadDateRange.ts";

export class NpmDownloadEndpointAssembler {
    private readonly DAY_LENGTH: number = 10;

    public assemble(packageNames: string[], npmDownloadDateRange: NpmDownloadDateRange): string {
        const fromDate: Date = npmDownloadDateRange.getFrom();
        const toDate: Date = npmDownloadDateRange.getTo();
        const from: string = this.formatDate(fromDate);
        const to: string = this.formatDate(toDate);
        const packages: string = packageNames.join(",");

        return `downloads/range/${from}:${to}/${packages}`;
    }

    private formatDate(date: Date): string {
        const isoDate: string = date.toISOString();

        return isoDate.slice(0, this.DAY_LENGTH);
    }
}
