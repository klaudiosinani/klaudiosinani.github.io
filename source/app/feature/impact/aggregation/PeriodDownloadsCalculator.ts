import type { OutletDownloads } from "../outlet/OutletDownloads";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class PeriodDownloadsCalculator {
    public compute(outlets: readonly OutletDownloads[], period: ReportingPeriod): number {
        return outlets.reduce((total: number, outlet: OutletDownloads) => total + (outlet[period] ?? 0), 0);
    }
}
