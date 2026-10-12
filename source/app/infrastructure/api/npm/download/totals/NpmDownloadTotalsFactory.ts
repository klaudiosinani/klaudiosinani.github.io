import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";
import { NpmDownloadTotals } from "./NpmDownloadTotals.ts";

export class NpmDownloadTotalsFactory {
    public createEmpty(): NpmDownloadTotals {
        const trend: Record<ReportingPeriod, number[]> = {
            month: [],
            quarter: [],
            year: [],
            all: [],
        };

        return new NpmDownloadTotals(0, 0, 0, 0, trend, null);
    }
}
