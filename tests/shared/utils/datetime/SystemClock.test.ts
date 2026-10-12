import { describe, expect, it, vi } from "vitest";
import { SystemClock } from "@app/util/datetime/SystemClock";

const underTest: typeof SystemClock = SystemClock;

describe("SystemClock.currentYear", () => {
    it("givenAFrozenClock_whenReadingTheCurrentYear_thenItFollowsTheClock", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2031-03-04T05:06:07Z"));

        const year: number = underTest.currentYear();

        expect(year).toBe(2031);

        vi.useRealTimers();
    });
});

describe("SystemClock.now", () => {
    it("givenAFrozenClock_whenReadingTheMoment_thenItFollowsTheClock", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2031-03-04T05:06:07Z"));

        expect(underTest.now().toISOString()).toBe("2031-03-04T05:06:07.000Z");

        vi.useRealTimers();
    });
});
