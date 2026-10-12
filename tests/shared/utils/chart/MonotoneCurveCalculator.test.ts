import { describe, expect, it } from "vitest";
import { MonotoneCurveCalculator } from "@app/util/chart/MonotoneCurveCalculator";
import type { TrendPoint } from "@app/util/chart/TrendPlot";

const underTest: typeof MonotoneCurveCalculator = MonotoneCurveCalculator;

const at = (values: number[]): TrendPoint[] => values.map((y: number, x: number) => ({ x: x * 10, y }));

const numbers = (path: string): number[] => (path.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);

describe("MonotoneCurveCalculator.compute", () => {
    it("givenNoPoints_whenBuilding_thenThereIsNoPath", () => {
        expect(underTest.compute([])).toBe("");
    });

    it("givenOnePoint_whenBuilding_thenThereIsNoPath", () => {
        expect(underTest.compute(at([5]))).toBe("");
    });

    it("givenTwoPoints_whenBuilding_thenThePathStartsAtTheFirstAndCurvesToTheSecond", () => {
        const path: string = underTest.compute(at([10, 20]));

        expect(path.startsWith("M 0.00 10.00")).toBe(true);
        expect(path).toContain("C ");
        expect(path.endsWith("10.00 20.00")).toBe(true);
    });

    it("givenAPeak_whenBuilding_thenTheCurveDoesNotGoAboveIt", () => {
        const path: string = underTest.compute(at([0, 100, 0]));

        expect(Math.max(...numbers(path))).toBeLessThanOrEqual(100);
    });

    it("givenAValley_whenBuilding_thenTheCurveDoesNotGoBelowIt", () => {
        const path: string = underTest.compute(at([100, 0, 100]));
        const ys: number[] = numbers(path).filter((_value: number, index: number) => index % 2 === 1);

        expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    });

    it("givenARisingSeries_whenBuilding_thenEveryPointIsOnThePath", () => {
        const path: string = underTest.compute(at([1, 2, 3, 4]));

        for (const y of ["1.00", "2.00", "3.00", "4.00"]) {
            expect(path).toContain(y);
        }
    });

    it("givenTwoEqualPoints_whenBuilding_thenTheCurveIsFlatBetweenThem", () => {
        const path: string = underTest.compute(at([50, 50, 50]));
        const ys: number[] = numbers(path).filter((_value: number, index: number) => index % 2 === 1);

        expect(ys.every((y: number) => y === 50)).toBe(true);
    });

    it("givenASmallStepBeforeALargeOne_whenBuilding_thenTheCurveStaysInsideItsPoints", () => {
        const path: string = underTest.compute(at([0, 1, 100]));
        const ys: number[] = numbers(path).filter((_value: number, index: number) => index % 2 === 1);

        expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
        expect(Math.max(...ys)).toBeLessThanOrEqual(100);
    });
});
