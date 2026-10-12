import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export interface ReleaseCountSource {
    compute(publishedAt: readonly string[], period: ReportingPeriod, windowsBack: number): number;
}
