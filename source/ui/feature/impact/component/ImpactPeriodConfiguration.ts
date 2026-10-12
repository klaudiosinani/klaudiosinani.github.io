import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class ImpactPeriodConfiguration {
    public readonly DEFAULT: ReportingPeriod = "year";

    public readonly LABELS: Readonly<Record<ReportingPeriod, string>> = {
        month: "30 days",
        quarter: "3 months",
        year: "12 months",
        all: "All time",
    };
}

export const IMPACT_PERIOD_CONFIGURATION: ImpactPeriodConfiguration = new ImpactPeriodConfiguration();
