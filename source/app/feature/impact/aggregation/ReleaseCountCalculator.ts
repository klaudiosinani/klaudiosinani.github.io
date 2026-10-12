import type { BuildClock } from "../../../util/datetime/BuildClock.ts";
import type { ReportingWindow } from "@app/util/period/ReportingWindow";
import type { ReportingWindowCalculator } from "@app/util/period/ReportingWindowCalculator";
import type { ReleaseCountSource } from "../github/ReleaseCountSource";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class ReleaseCountCalculator implements ReleaseCountSource {
    private readonly today: Date;
    private readonly reportingWindowCalculator: ReportingWindowCalculator;

    public constructor(buildClock: BuildClock, reportingWindowCalculator: ReportingWindowCalculator) {
        this.today = buildClock.now();
        this.reportingWindowCalculator = reportingWindowCalculator;
    }

    public compute(publishedAt: readonly string[], period: ReportingPeriod, windowsBack: number): number {
        if (period === "all") {
            return windowsBack === 0 ? publishedAt.length : 0;
        }

        const reportingWindow: ReportingWindow = this.reportingWindowCalculator.compute(
            period,
            windowsBack,
            this.today
        );

        return publishedAt.filter((stamp: string) => {
            const at: number = Date.parse(stamp);

            return (
                at >= reportingWindow.getStart().getTime() &&
                (windowsBack === 0 || at < reportingWindow.getEnd().getTime())
            );
        }).length;
    }
}
