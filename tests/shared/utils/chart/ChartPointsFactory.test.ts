import { describe, expect, it } from "vitest";
import type { ChartPoint } from "@app/util/chart/ChartPoint";
import { ChartPointsFactory } from "@app/util/chart/ChartPointsFactory";

const underTest: typeof ChartPointsFactory = ChartPointsFactory;

const FROM: Date = new Date("2026-01-01T00:00:00Z");
const TO: Date = new Date("2026-01-11T00:00:00Z");

describe("ChartPointsFactory.create", () => {
    it("givenASeriesAndAWindow_whenRead_thenEachPointCarriesItsDay", () => {
        const points: ChartPoint[] = underTest.create([1, 2, 3], FROM, TO);

        expect(points.map(({ at }: ChartPoint) => at)).toEqual(["Jan 1, 2026", "Jan 6, 2026", "Jan 11, 2026"]);
    });

    it("givenASeries_whenRead_thenEveryFigureIsKept", () => {
        expect(underTest.create([4, 5], FROM, TO).map((p: ChartPoint) => p.value)).toEqual([4, 5]);
    });

    it("givenAWindowWithNoStart_whenRead_thenTheFiguresCarryNoDay", () => {
        expect(underTest.create([1, 2], null, TO)).toEqual([
            { at: "", value: 1 },
            { at: "", value: 2 },
        ]);
    });

    it("givenOneReading_whenRead_thenItCarriesNoDay", () => {
        expect(underTest.create([7], FROM, TO)).toEqual([{ at: "", value: 7 }]);
    });

    it("givenNoReading_whenRead_thenThereIsNothingToPointAt", () => {
        expect(underTest.create([], FROM, TO)).toEqual([]);
    });
});

describe("ChartPointsFactory.all", () => {
    it("givenEveryWindow_whenRead_thenEachIsMeasuredAgainstItsOwnStart", () => {
        const points: Record<string, ChartPoint[]> = underTest.all(
            { month: [1, 2], quarter: [], year: [], all: [9] },
            { month: FROM, quarter: FROM, year: FROM, all: null },
            TO
        );

        expect(points.month[0].at).toBe("Jan 1, 2026");
        expect(points.all[0]).toEqual({ at: "", value: 9 });
        expect(points.quarter).toEqual([]);
    });
});
