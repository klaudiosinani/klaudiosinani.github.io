import { describe, expect, it } from "vitest";
import { MonthSeriesLabeler } from "@app/util/datetime/MonthSeriesLabeler";

describe("MonthSeriesLabeler", () => {
    const monthSeriesLabeler: MonthSeriesLabeler = new MonthSeriesLabeler();

    it("givenASeriesFrom2018_whenLabelling_thenEachMonthIsNamedWithItsYear", () => {
        const labels: string[] = monthSeriesLabeler.label(2018, 105);

        expect(labels[0]).toBe("Jan 2018");
        expect(labels[12]).toBe("Jan 2019");
        expect(labels[104]).toBe("Sep 2026");
    });
});
