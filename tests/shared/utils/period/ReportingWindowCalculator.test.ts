import { describe, expect, it } from "vitest";
import { ReportingWindowCalculator } from "@app/util/period/ReportingWindowCalculator";

import type { ReportingWindow } from "@app/util/period/ReportingWindow";
const underTest: typeof ReportingWindowCalculator = ReportingWindowCalculator;

const TODAY: Date = new Date("2026-08-11T00:00:00Z");

const iso = (date: Date): string => date.toISOString().slice(0, 10);

describe("ReportingWindowCalculator.compute", () => {
    it("givenTheCurrentWindow_whenComputing_thenItEndsToday", () => {
        const window: ReportingWindow = underTest.compute("month", 0, TODAY);

        expect(iso(window.getEnd())).toBe("2026-08-11");
        expect(iso(window.getStart())).toBe("2026-07-12");
    });

    it("givenThePreviousWindow_whenComputing_thenItEndsWhereTheCurrentOneStarts", () => {
        const current: ReportingWindow = underTest.compute("month", 0, TODAY);
        const previous: ReportingWindow = underTest.compute("month", 1, TODAY);

        expect(previous.getEnd().getTime()).toBe(current.getStart().getTime());
        expect(iso(previous.getStart())).toBe("2026-06-12");
    });

    it("givenALongerPeriod_whenComputing_thenTheSpanFollowsThatPeriod", () => {
        const window: ReportingWindow = underTest.compute("year", 0, TODAY);

        expect(iso(window.getStart())).toBe("2025-08-11");
    });
});
