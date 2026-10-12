import { MetricDelta } from "./MetricDelta";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class MetricDeltaCalculator {
    private readonly AGAINST: Record<ReportingPeriod, string | null> = {
        month: "previous 30 days",
        quarter: "previous 3 months",
        year: "previous 12 months",
        all: null,
    };

    public compute(current: number, previous: number | null, period: ReportingPeriod): MetricDelta | null {
        const against: string | null = this.AGAINST[period];

        if (against === null || previous === null || previous === 0) {
            return null;
        }

        const change: number = ((current - previous) / previous) * 100;
        const direction: "up" | "down" = change >= 0 ? "up" : "down";
        const rounded: string = this.round(Math.abs(change));

        return new MetricDelta(
            `${change >= 0 ? "+" : "−"}${rounded}%`,
            direction,
            `${direction} ${rounded}% against the ${against}`
        );
    }

    private round(value: number): string {
        return value >= 10 ? String(Math.round(value)) : value.toFixed(1);
    }
}
