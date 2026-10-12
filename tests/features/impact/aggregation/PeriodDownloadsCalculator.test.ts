import { describe, expect, it } from "vitest";
import type { OutletDownloads } from "@app/feature/impact/OutletDownloads";
import { PeriodDownloadsCalculator } from "@app/feature/impact/aggregation/PeriodDownloadsCalculator";

const underTest: typeof PeriodDownloadsCalculator = PeriodDownloadsCalculator;

const outlets: OutletDownloads[] = [
    { outlet: "npm", month: 100, quarter: 300, year: 1200, all: 5000 },
    { outlet: "github", month: null, quarter: null, year: null, all: 40 },
    { outlet: "pypi", month: 7, quarter: null, year: null, all: null },
];

describe("PeriodDownloadsCalculator.compute", () => {
    it("givenSeveralOutlets_whenAddingAWindow_thenEveryReportedCountIsIncluded", () => {
        expect(underTest.compute(outlets, "month")).toBe(107);
        expect(underTest.compute(outlets, "all")).toBe(5040);
    });

    it("givenAnOutletThatCannotReportAWindow_whenAdding_thenItAddsNothing", () => {
        expect(underTest.compute(outlets, "quarter")).toBe(300);
    });

    it("givenNoOutlet_whenAdding_thenTheTotalIsZero", () => {
        expect(underTest.compute([], "year")).toBe(0);
    });
});
