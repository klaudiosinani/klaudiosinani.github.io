import { describe, expect, it } from "vitest";
import type { ContributionDay } from "@app/feature/impact/ContributionDay";
import { ContributionWeeksFactory } from "@ui/feature/impact/component/ContributionWeeksFactory";

const underTest: typeof ContributionWeeksFactory = ContributionWeeksFactory;

const day = (date: string, count: number = 1): ContributionDay => ({
    date,
    count,
});

describe("ContributionWeeksFactory.create", () => {
    it("givenAYearThatOpensOnASunday_whenBuilding_thenTheFirstColumnIsFull", () => {
        const weeks: (ContributionDay | null)[][] = underTest.create([
            day("2026-08-16"),
            day("2026-08-17"),
            day("2026-08-18"),
            day("2026-08-19"),
            day("2026-08-20"),
            day("2026-08-21"),
            day("2026-08-22"),
        ]);

        expect(weeks).toHaveLength(1);
        expect(weeks[0].filter(Boolean)).toHaveLength(7);
    });

    it("givenAYearThatOpensInTheMiddleOfAWeek_whenBuilding_thenThePlacesBeforeItAreEmpty", () => {
        const weeks: (ContributionDay | null)[][] = underTest.create([day("2026-08-19")]);

        expect(weeks[0].slice(0, 3)).toEqual([null, null, null]);
        expect(weeks[0][3]?.date).toBe("2026-08-19");
    });

    it("givenAWeekThatIsNotFull_whenBuilding_thenItIsFilledToSevenPlaces", () => {
        expect(underTest.create([day("2026-08-16")])[0]).toHaveLength(7);
    });

    it("givenNoDays_whenBuilding_thenThereIsNoCalendar", () => {
        expect(underTest.create([])).toEqual([]);
    });
});
