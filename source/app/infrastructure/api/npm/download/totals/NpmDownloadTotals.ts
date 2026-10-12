import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class NpmDownloadTotals {
    private readonly month: number;
    private readonly quarter: number;
    private readonly year: number;
    private readonly all: number;
    private readonly trend: Record<ReportingPeriod, number[]>;
    private readonly lastPublishedDay: string | null;

    public constructor(
        month: number,
        quarter: number,
        year: number,
        all: number,
        trend: Record<ReportingPeriod, number[]>,
        lastPublishedDay: string | null
    ) {
        this.month = month;
        this.quarter = quarter;
        this.year = year;
        this.all = all;
        this.trend = trend;
        this.lastPublishedDay = lastPublishedDay;
    }

    public getMonth(): number {
        return this.month;
    }

    public getQuarter(): number {
        return this.quarter;
    }

    public getYear(): number {
        return this.year;
    }

    public getAll(): number {
        return this.all;
    }

    public getTrend(): Record<ReportingPeriod, number[]> {
        return this.trend;
    }

    public getLastPublishedDay(): string | null {
        return this.lastPublishedDay;
    }
}
