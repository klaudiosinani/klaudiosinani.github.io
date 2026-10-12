import { describe, expect, it } from "vitest";

import { TrendMarkerCalculator } from "@app/util/chart/TrendMarkerCalculator";

import type { TrendPoint } from "@app/util/chart/TrendPlot";
describe("TrendMarkerCalculator", () => {
    const underTest: typeof TrendMarkerCalculator = TrendMarkerCalculator;

    it("givenNoPoint_whenStyle_thenReturnsNull", () => {
        const end: null = null;

        const style: string | null = underTest.compute(end, 960, 180);

        expect(style).toBeNull();
    });

    it("givenPoint_whenStyle_thenPlacesItInPercentOfTheDrawing", () => {
        const end: TrendPoint = { x: 480, y: 45 };

        const style: string | null = underTest.compute(end, 960, 180);

        expect(style).toBe("left:50.000%;top:25.000%");
    });

    it("givenLastPoint_whenStyle_thenPlacesItAtTheRightEdge", () => {
        const end: TrendPoint = { x: 960, y: 180 };

        const style: string | null = underTest.compute(end, 960, 180);

        expect(style).toBe("left:100.000%;top:100.000%");
    });
});
