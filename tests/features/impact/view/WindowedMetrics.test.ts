import { describe, expect, it } from "vitest";
import type { ImpactFigure } from "@ui/feature/impact/component/ImpactFigure";
import { WindowedMetrics } from "@ui/feature/impact/component/WindowedMetrics";

import type { WindowedMetric } from "@ui/feature/impact/component/WindowedMetric";
const underTest: typeof WindowedMetrics = WindowedMetrics;

const figure: ImpactFigure = { compact: "1", exact: "1" };

const figures = (...keys: string[]): Record<string, ImpactFigure> =>
    Object.fromEntries(keys.map((key: string) => [key, figure]));

describe("WindowedMetrics.ALL", () => {
    it("givenTheBlock_whenListed_thenEveryEntryHasANameALabelAndAnIcon", () => {
        expect(underTest.ALL.length).toBeGreaterThan(0);

        for (const metric of underTest.ALL) {
            expect(metric.key.length).toBeGreaterThan(0);
            expect(metric.label.length).toBeGreaterThan(0);
            expect(metric.icon).toBeTypeOf("function");
        }
    });

    it("givenTheBlock_whenListed_thenSustainedOutputComesFirst", () => {
        expect(underTest.ALL[0].key).toBe("commits");
    });

    it("givenTheBlock_whenListed_thenNoFigureAppearsTwice", () => {
        expect(new Set(underTest.KEYS).size).toBe(underTest.KEYS.length);
    });
});

describe("WindowedMetrics.KEYS", () => {
    it("givenTheNames_whenRead_thenTheyFollowTheOrderOfTheBlock", () => {
        expect(underTest.KEYS).toEqual(underTest.ALL.map(({ key }: WindowedMetric) => key));
    });
});

describe("WindowedMetrics.reported", () => {
    it("givenEveryFigure_whenSelecting_thenTheWholeBlockIsShown", () => {
        const collected: Record<string, ImpactFigure> = figures(...underTest.KEYS);

        const reported: readonly WindowedMetric[] = underTest.reported(collected);

        expect(reported).toEqual(underTest.ALL);
    });

    it("givenAFigureTheBuildCouldNotCollect_whenSelecting_thenItIsLeftOut", () => {
        const collected: Record<string, ImpactFigure> = figures("commits");

        const reported: readonly WindowedMetric[] = underTest.reported(collected);

        expect(reported.map(({ key }: WindowedMetric) => key)).toEqual(["commits"]);
    });
});
