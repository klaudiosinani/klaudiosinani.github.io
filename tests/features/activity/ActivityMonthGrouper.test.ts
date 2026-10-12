import { describe, expect, it } from "vitest";
import { ActivityMonthGrouper } from "@app/feature/activity/service/ActivityMonthGrouper";
import type { ActivityEntry } from "@app/feature/activity/ActivityEntry";
import type { ActivityMonth } from "@app/feature/activity/ActivityMonth";

const underTest: typeof ActivityMonthGrouper = ActivityMonthGrouper;

const entry = (occurredAt: string): ActivityEntry => ({
    kind: "commit",
    title: "A change",
    reference: "a1b2c3d",
    context: "example",
    url: "https://github.com/user/example",
    occurredAt,
});

describe("ActivityMonthGrouper.group", () => {
    it("givenEntriesOfOneMonth_whenGrouping_thenTheyStandUnderOneName", () => {
        const months: ActivityMonth[] = underTest.group([entry("2026-08-09T00:00:00Z"), entry("2026-08-01T00:00:00Z")]);

        expect(months).toHaveLength(1);
        expect(months[0].name).toBe("August 2026");
        expect(months[0].entries).toHaveLength(2);
    });

    it("givenEntriesAcrossMonths_whenGrouping_thenTheOrderOfTheFeedIsKept", () => {
        expect(
            underTest
                .group([entry("2026-08-09T00:00:00Z"), entry("2026-07-30T00:00:00Z"), entry("2025-12-01T00:00:00Z")])
                .map(({ name }: ActivityMonth) => name)
        ).toEqual(["August 2026", "July 2026", "December 2025"]);
    });

    it("givenTheSameMonthOfTwoYears_whenGrouping_thenTheyAreNotJoined", () => {
        expect(underTest.group([entry("2026-08-09T00:00:00Z"), entry("2025-08-09T00:00:00Z")])).toHaveLength(2);
    });

    it("givenAnEmptyFeed_whenGrouping_thenThereAreNoMonths", () => {
        expect(underTest.group([])).toEqual([]);
    });
});
