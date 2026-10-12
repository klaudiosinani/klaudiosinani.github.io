import { describe, expect, it } from "vitest";
import { ReleaseCountCalculator } from "@app/feature/impact/aggregation/ReleaseCountCalculator";

const TODAY: Date = new Date("2026-08-11T00:00:00Z");

const underTest: ReleaseCountCalculator = new ReleaseCountCalculator(TODAY);

describe("ReleaseCountCalculator.compute", () => {
    it("givenPublicationDates_whenCountingAWindow_thenOlderReleasesAreExcluded", () => {
        const published: string[] = ["2026-08-10T00:00:00Z", "2026-07-01T00:00:00Z", "2019-01-01T00:00:00Z"];

        const month: number = underTest.compute(published, "month");
        const year: number = underTest.compute(published, "year");

        expect(month).toBe(1);
        expect(year).toBe(2);
    });

    it("givenPublicationDates_whenCountingAllTime_thenEveryReleaseCounts", () => {
        const published: string[] = ["2026-08-10T00:00:00Z", "2019-01-01T00:00:00Z"];

        const all: number = underTest.compute(published, "all");

        expect(all).toBe(2);
    });

    it("givenAPreviousWindow_whenCounting_thenOnlyThatWindowIsIncluded", () => {
        const dates: string[] = ["2026-08-05T00:00:00Z", "2026-07-01T00:00:00Z", "2026-05-01T00:00:00Z"];

        const previous: number = underTest.compute(dates, "month", 1);

        expect(previous).toBe(1);
    });

    it("givenAllTime_whenCountingThePreviousWindow_thenThereIsNone", () => {
        const previous: number = underTest.compute(["2020-01-01T00:00:00Z"], "all", 1);

        expect(previous).toBe(0);
    });

    it("givenNoClock_whenConstructed_thenItCountsAgainstTheCurrentDate", () => {
        const now: string = new Date().toISOString();

        const counted: number = new ReleaseCountCalculator().compute([now], "month");

        expect(counted).toBe(1);
    });
});
