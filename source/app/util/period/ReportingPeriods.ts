import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class ReportingPeriods {
    public readonly ALL: readonly ["month", "quarter", "year", "all"] = ["month", "quarter", "year", "all"] as const;

    private readonly DAYS: Record<Exclude<ReportingPeriod, "all">, number> = {
        month: 30,
        quarter: 90,
        year: 365,
    };

    public days(period: Exclude<ReportingPeriod, "all">): number {
        return this.DAYS[period];
    }
}
