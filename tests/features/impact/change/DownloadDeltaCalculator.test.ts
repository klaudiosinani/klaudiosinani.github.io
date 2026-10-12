import { describe, expect, it } from "vitest";
import { DownloadDeltaCalculator } from "@app/feature/impact/change/DownloadDeltaCalculator";

import type { MetricDelta } from "@app/feature/impact/change/MetricDelta";
const underTest: typeof DownloadDeltaCalculator = DownloadDeltaCalculator;

const series = (days: number, previous: number, current: number): number[] => [
    ...Array.from({ length: 365 - days }, () => previous),
    ...Array.from({ length: days }, () => current),
];

describe("DownloadDeltaCalculator.compute", () => {
    it("givenAGrowingMonth_whenResolving_thenTheChangeIsUpAndSigned", () => {
        const trend: number[] = series(30, 100, 110);

        const delta: MetricDelta | null = underTest.compute(trend, "month");

        expect(delta).toEqual({
            text: "+10%",
            direction: "up",
            label: "up 10% against the previous 30 days",
        });
    });

    it("givenAFallingQuarter_whenResolving_thenTheChangeIsDown", () => {
        const trend: number[] = series(90, 200, 190);

        const delta: MetricDelta | null = underTest.compute(trend, "quarter");

        expect(delta?.getDirection()).toBe("down");
        expect(delta?.getText()).toBe("−5.0%");
        expect(delta?.getLabel()).toBe("down 5.0% against the previous 3 months");
    });

    it("givenASmallChange_whenResolving_thenOneDecimalIsShown", () => {
        const trend: number[] = series(30, 1000, 1025);

        const delta: MetricDelta | null = underTest.compute(trend, "month");

        expect(delta?.getText()).toBe("+2.5%");
    });

    it("givenTheYearWindow_whenResolving_thenThereIsNothingToCompareAgainst", () => {
        const delta: MetricDelta | null = underTest.compute(series(30, 100, 110), "year");

        expect(delta).toBeNull();
    });

    it("givenAllTime_whenResolving_thenThereIsNoPreviousWindow", () => {
        const delta: MetricDelta | null = underTest.compute(series(30, 100, 110), "all");

        expect(delta).toBeNull();
    });

    it("givenASeriesShorterThanTwoWindows_whenResolving_thenNoDeltaIsClaimed", () => {
        const trend: number[] = Array.from({ length: 100 }, () => 50);

        const delta: MetricDelta | null = underTest.compute(trend, "quarter");

        expect(delta).toBeNull();
    });

    it("givenAPreviousWindowOfZero_whenResolving_thenNoPercentageIsInvented", () => {
        const trend: number[] = series(30, 0, 10);

        const delta: MetricDelta | null = underTest.compute(trend, "month");

        expect(delta).toBeNull();
    });

    it("givenNoChangeAtAll_whenResolving_thenTheDeltaCountsAsUp", () => {
        const trend: number[] = series(30, 100, 100);

        const delta: MetricDelta | null = underTest.compute(trend, "month");

        expect(delta?.getDirection()).toBe("up");
        expect(delta?.getText()).toBe("+0.0%");
    });
});
