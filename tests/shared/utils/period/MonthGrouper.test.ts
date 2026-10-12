import { describe, expect, it } from "vitest";
import { MonthGrouper } from "@app/util/period/MonthGrouper";
import type { MonthGroup } from "@app/util/period/MonthGrouper";

const underTest: typeof MonthGrouper = MonthGrouper;

interface Thing {
    at: string;
}

const at = (item: Thing): string => item.at;

describe("MonthGrouper.group", () => {
    it("givenThingsOfOneMonth_whenGrouping_thenTheyStandUnderOneName", () => {
        const months: MonthGroup<Thing>[] = underTest.group(
            [{ at: "2026-08-09T00:00:00Z" }, { at: "2026-08-01T00:00:00Z" }],
            at
        );

        expect(months).toHaveLength(1);
        expect(months[0].name).toBe("August 2026");
        expect(months[0].items).toHaveLength(2);
    });

    it("givenThingsAcrossMonths_whenGrouping_thenTheOrderOfTheListIsKept", () => {
        expect(
            underTest
                .group(
                    [{ at: "2026-08-09T00:00:00Z" }, { at: "2026-07-30T00:00:00Z" }, { at: "2025-12-01T00:00:00Z" }],
                    at
                )
                .map(({ name }: MonthGroup<Thing>) => name)
        ).toEqual(["August 2026", "July 2026", "December 2025"]);
    });

    it("givenTheSameMonthOfTwoYears_whenGrouping_thenTheyAreNotJoined", () => {
        expect(underTest.group([{ at: "2026-08-09T00:00:00Z" }, { at: "2025-08-09T00:00:00Z" }], at)).toHaveLength(2);
    });

    it("givenNothing_whenGrouping_thenThereAreNoMonths", () => {
        expect(underTest.group([], at)).toEqual([]);
    });
});
