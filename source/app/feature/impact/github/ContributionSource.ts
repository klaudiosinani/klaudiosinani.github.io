import type { ContributionTotals } from "./ContributionTotals";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export interface ContributionSource {
    contributions(username: string, period: ReportingPeriod): Promise<ContributionTotals | null>;
}
