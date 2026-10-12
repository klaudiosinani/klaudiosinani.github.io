import type { ReportingPeriods } from "@app/util/period/ReportingPeriods";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";
import type { NpmDownloadCount } from "../count/NpmDownloadCount.ts";
import type { NpmDownloadPublicationTrimmer } from "../count/NpmDownloadPublicationTrimmer.ts";
import { NpmDownloadTotals } from "./NpmDownloadTotals.ts";

export class NpmDownloadTotalsCalculator {
    private readonly reportingPeriods: ReportingPeriods;
    private readonly npmDownloadPublicationTrimmer: NpmDownloadPublicationTrimmer;

    public constructor(
        reportingPeriods: ReportingPeriods,
        npmDownloadPublicationTrimmer: NpmDownloadPublicationTrimmer
    ) {
        this.reportingPeriods = reportingPeriods;
        this.npmDownloadPublicationTrimmer = npmDownloadPublicationTrimmer;
    }

    public calculate(daily: NpmDownloadCount[], monthly: NpmDownloadCount[]): NpmDownloadTotals {
        const published: NpmDownloadCount[] = this.npmDownloadPublicationTrimmer.trimDays(daily);
        const lastPublishedDay: string | null = this.npmDownloadPublicationTrimmer.resolveLastPublishedDay(daily);

        return new NpmDownloadTotals(
            this.sum(this.lastDays(published, "month")),
            this.sum(this.lastDays(published, "quarter")),
            this.sum(published),
            this.sum(monthly),
            this.calculateTrend(published, monthly, lastPublishedDay),
            lastPublishedDay
        );
    }

    private calculateTrend(
        published: NpmDownloadCount[],
        monthly: NpmDownloadCount[],
        lastPublishedDay: string | null
    ): Record<ReportingPeriod, number[]> {
        return {
            month: this.counts(this.lastDays(published, "month")),
            quarter: this.counts(this.lastDays(published, "quarter")),
            year: this.counts(published),
            all: this.counts(this.npmDownloadPublicationTrimmer.trimRunningMonth(monthly, lastPublishedDay)),
        };
    }

    private lastDays(
        npmDownloadCounts: NpmDownloadCount[],
        reportingPeriod: Exclude<ReportingPeriod, "all">
    ): NpmDownloadCount[] {
        const days: number = this.reportingPeriods.days(reportingPeriod);

        return npmDownloadCounts.slice(-days);
    }

    private counts(npmDownloadCounts: NpmDownloadCount[]): number[] {
        return npmDownloadCounts.map((npmDownloadCount: NpmDownloadCount) => npmDownloadCount.getCount());
    }

    private sum(npmDownloadCounts: NpmDownloadCount[]): number {
        return npmDownloadCounts.reduce(
            (total: number, npmDownloadCount: NpmDownloadCount) => total + npmDownloadCount.getCount(),
            0
        );
    }
}
