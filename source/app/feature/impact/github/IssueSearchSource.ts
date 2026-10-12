import type { IssueTotals } from "./IssueTotals";
import type { OpenTotals } from "../metric/OpenTotals";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export interface IssueSearchSource {
    contributions(username: string, period: ReportingPeriod, windowsBack: number): Promise<IssueTotals>;
    open(username: string): Promise<OpenTotals>;
}
