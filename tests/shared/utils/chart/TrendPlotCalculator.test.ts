import { describe, expect, it } from "vitest";
import { TrendPlotCalculator } from "@app/util/chart/TrendPlotCalculator";

import type { TrendPoint } from "@app/util/chart/TrendPlot";
const underTest: typeof TrendPlotCalculator = TrendPlotCalculator;

const WIDTH: number = 960;
const HEIGHT: number = 180;

const anchors = (path: string): { x: number; y: number }[] => {
    const numbers: [] | RegExpMatchArray = path.match(/-?\d+(?:\.\d+)?/g) ?? [];
    const points: { x: number; y: number }[] = [];

    for (let index: number = 0; index + 1 < numbers.length; index += index === 0 ? 2 : 6) {
        const at: number = index === 0 ? 0 : index + 4;

        if (at + 1 < numbers.length) {
            points.push({ x: Number(numbers[at]), y: Number(numbers[at + 1]) });
        }
    }

    return points;
};

const ys = (path: string): number[] => anchors(path).map((point: TrendPoint) => point.y);

const xs = (path: string): number[] => anchors(path).map((point: TrendPoint) => point.x);

const weekly = (days: number, base: number = 100): number[] =>
    Array.from({ length: days }, (_: unknown, day: number) => (day % 7 === 5 || day % 7 === 6 ? base * 0.42 : base));

const roughness = (points: string): number => {
    const heights: number[] = ys(points);
    const jumps: number[] = heights.slice(1).map((value: number, index: number) => Math.abs(value - heights[index]));

    return Math.max(...jumps) / HEIGHT;
};

describe("TrendPlotCalculator.compute", () => {
    it("givenAnEmptySeries_whenPlotting_thenNothingIsDrawn", () => {
        const { line, area } = underTest.compute([], WIDTH, HEIGHT);

        expect(line).toBe("");
        expect(area).toBe("");
    });

    it("givenASinglePoint_whenPlotting_thenNothingIsDrawn", () => {
        const { line } = underTest.compute([100], WIDTH, HEIGHT);

        expect(line).toBe("");
    });

    it("givenAWeeklyRhythm_whenPlottingWithoutTheCycle_thenTheLineIsACombOfSpikes", () => {
        const { line } = underTest.compute(weekly(90), WIDTH, HEIGHT, 1);

        expect(roughness(line)).toBeGreaterThan(0.5);
    });

    it("givenAWeeklyRhythm_whenPlottingWithTheCycle_thenTheLineReadsAsATrend", () => {
        const { line } = underTest.compute(weekly(90), WIDTH, HEIGHT, 7);

        expect(roughness(line)).toBeLessThan(0.1);
    });

    it("givenAYearOfDailyPoints_whenPlotting_thenBucketsStayWholeWeeks", () => {
        const rising: number[] = weekly(365).map((value: number, day: number) => value + day);

        const { line } = underTest.compute(rising, WIDTH, HEIGHT, 7);

        expect(roughness(line)).toBeLessThan(0.1);
        expect(xs(line).length).toBeLessThanOrEqual(120);
    });

    it("givenASeriesFarAboveZero_whenPlotting_thenItIsScaledLowToHighNotFromZero", () => {
        const trend: number[] = [...Array(60).fill(280_000), ...Array(60).fill(440_000)];

        const { line } = underTest.compute(trend, WIDTH, HEIGHT, 1);

        const heights: number[] = ys(line);
        expect(Math.max(...heights) - Math.min(...heights)).toBeGreaterThan(HEIGHT * 0.8);
    });

    it("givenAFlatSeries_whenPlotting_thenItIsDrawnDownTheMiddle", () => {
        const trend: number[] = Array.from({ length: 20 }, () => 1000);

        const { line } = underTest.compute(trend, WIDTH, HEIGHT, 1);

        expect(new Set(ys(line)).size).toBe(1);
    });

    it("givenAnySeries_whenPlotting_thenTheStrokeIsHeldClearOfTheEdges", () => {
        const trend: number[] = [...Array(30).fill(1), ...Array(30).fill(100)];

        const { line } = underTest.compute(trend, WIDTH, HEIGHT, 1);

        const heights: number[] = ys(line);
        expect(Math.min(...heights)).toBeGreaterThan(0);
        expect(Math.max(...heights)).toBeLessThan(HEIGHT);
    });

    it("givenASeries_whenPlotting_thenTheAreaClosesAlongTheBaseline", () => {
        const trend: number[] = weekly(30);

        const { line, area } = underTest.compute(trend, WIDTH, HEIGHT, 7);

        expect(area.startsWith(line)).toBe(true);
        expect(area).toContain(`L ${WIDTH.toFixed(2)} ${HEIGHT.toFixed(2)}`);
        expect(area).toContain(`L 0 ${HEIGHT.toFixed(2)}`);
        expect(area.endsWith("Z")).toBe(true);
    });

    it("givenASeries_whenPlotting_thenTheMarkerSitsOnTheMostRecentPoint", () => {
        const trend: number[] = weekly(30);

        const { line, end } = underTest.compute(trend, WIDTH, HEIGHT, 7);
        const last: TrendPoint = anchors(line)[anchors(line).length - 1];

        expect(end?.x).toBeCloseTo(last.x, 1);
        expect(end?.y).toBeCloseTo(last.y, 1);
    });

    it("givenTooFewPoints_whenPlotting_thenThereIsNoMarker", () => {
        expect(underTest.compute([], WIDTH, HEIGHT).end).toBeNull();
    });

    it("givenASeries_whenPlotting_thenItSpansTheFullWidth", () => {
        const trend: number[] = weekly(30);

        const { line } = underTest.compute(trend, WIDTH, HEIGHT, 7);
        const horizontal: number[] = xs(line);

        expect(horizontal[0]).toBe(0);
        expect(horizontal[horizontal.length - 1]).toBeCloseTo(WIDTH, 1);
    });

    it("givenASeriesShorterThanItsCycle_whenPlotting_thenItIsLeftUnsmoothed", () => {
        const trend: number[] = [10, 90, 10];

        const { line } = underTest.compute(trend, WIDTH, HEIGHT, 7);

        expect(ys(line)).toHaveLength(3);
    });
});
