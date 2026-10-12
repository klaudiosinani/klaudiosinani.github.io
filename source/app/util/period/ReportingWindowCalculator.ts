import type { ReportingPeriods } from "@app/util/period/ReportingPeriods";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";
import { ReportingWindow } from "@app/util/period/ReportingWindow";

export class ReportingWindowCalculator {
    private readonly reportingPeriods: ReportingPeriods;
    private readonly DAY: number = 24 * 60 * 60 * 1000;

    public constructor(reportingPeriods: ReportingPeriods) {
        this.reportingPeriods = reportingPeriods;
    }

    public compute(period: Exclude<ReportingPeriod, "all">, windowsBack: number, today: Date): ReportingWindow {
        const span: number = this.reportingPeriods.days(period) * this.DAY;
        const end: number = today.getTime() - span * windowsBack;

        return new ReportingWindow(new Date(end - span), new Date(end));
    }
}
