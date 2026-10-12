import { describe, expect, it } from "vitest";
import { ImpactChartConfiguration } from "@ui/feature/impact/component/ImpactChartConfiguration";
import { ReportingPeriods } from "@app/util/period/ReportingPeriods";

const underTest: typeof ImpactChartConfiguration = ImpactChartConfiguration;

describe("ImpactChartConfiguration.VIEW_BOX", () => {
    it("givenTheCoordinateSystem_whenReadingTheViewBox_thenItStatesTheSameWidthAndHeight", () => {
        expect(underTest.VIEW_BOX).toBe(`0 0 ${underTest.WIDTH} ${underTest.HEIGHT}`);
    });

    it("givenTheDrawing_whenReadingTheExtents_thenItIsWiderThanItIsTall", () => {
        expect(underTest.WIDTH).toBeGreaterThan(underTest.HEIGHT);
    });
});

describe("ImpactChartConfiguration.cycle", () => {
    it("givenADailySeries_whenReadingTheCycle_thenItIsOneWeek", () => {
        expect(underTest.cycle("month")).toBe(7);
        expect(underTest.cycle("quarter")).toBe(7);
        expect(underTest.cycle("year")).toBe(7);
    });

    it("givenTheAllTimeSeries_whenReadingTheCycle_thenNothingIsRemoved", () => {
        expect(underTest.cycle("all")).toBe(1);
    });

    it("givenEveryWindow_whenReadingTheCycle_thenACycleExists", () => {
        for (const period of ReportingPeriods.ALL) {
            expect(underTest.cycle(period)).toBeGreaterThan(0);
        }
    });
});
