import { describe, expect, it } from "vitest";
import { ImpactChartConfiguration } from "@ui/feature/impact/component/ImpactChartConfiguration";
import { ImpactChartCalculator } from "@ui/feature/impact/component/ImpactChartCalculator";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

import type { ImpactChart } from "@ui/feature/impact/component/ImpactChart";
const underTest: typeof ImpactChartCalculator = ImpactChartCalculator;

const rising = (length: number): number[] => Array.from({ length }, (_: unknown, index: number) => 100 + index);

const trend = (overrides: Partial<Record<ReportingPeriod, number[]>> = {}): Record<ReportingPeriod, number[]> => ({
    month: rising(30),
    quarter: rising(90),
    year: rising(365),
    all: rising(24),
    ...overrides,
});

describe("ImpactChartCalculator.compute", () => {
    it("givenASeriesForEveryWindow_whenResolving_thenEachOneGetsItsOwnCurve", () => {
        const charts: Record<"month" | "quarter" | "year" | "all", ImpactChart> = underTest.compute(trend());

        expect(Object.keys(charts)).toEqual(["month", "quarter", "year", "all"]);

        for (const chart of Object.values(charts)) {
            expect(chart.line.startsWith("M")).toBe(true);
            expect(chart.area.endsWith("Z")).toBe(true);
        }
    });

    it("givenDifferentSeries_whenResolving_thenTheWindowsDoNotShareACurve", () => {
        const charts: Record<"month" | "quarter" | "year" | "all", ImpactChart> = underTest.compute(trend());

        expect(charts.month.line).not.toBe(charts.year.line);
    });

    it("givenACurve_whenResolving_thenTheMarkerSitsOnTheMostRecentPoint", () => {
        const charts: Record<"month" | "quarter" | "year" | "all", ImpactChart> = underTest.compute(trend());

        expect(charts.year.marker).toBe("left:100.000%;top:2.222%");
    });

    it("givenNoSeries_whenResolving_thenThereIsNothingToDrawAndNoMarker", () => {
        const charts: Record<"month" | "quarter" | "year" | "all", ImpactChart> = underTest.compute(
            trend({ month: [] })
        );

        expect(charts.month.line).toBe("");
        expect(charts.month.area).toBe("");
        expect(charts.month.marker).toBeNull();
    });

    it("givenTheCoordinateSystem_whenResolving_thenTheCurveStaysInsideTheBox", () => {
        const charts: Record<"month" | "quarter" | "year" | "all", ImpactChart> = underTest.compute(trend());
        const numbers: [] | RegExpMatchArray = charts.year.area.match(/[\d.]+/g) ?? [];

        for (const value of numbers) {
            expect(Number(value)).toBeLessThanOrEqual(ImpactChartConfiguration.WIDTH);
        }
    });
});
