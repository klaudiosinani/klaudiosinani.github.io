import { describe, expect, it, vi } from "vitest";
import { SystemClock } from "@utils/datetime/SystemClock";

const underTest = SystemClock;

describe("SystemClock.currentYear", () => {
  it("givenAFrozenClock_whenReadingTheCurrentYear_thenItFollowsTheClock", () => {
    // given
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-03-04T05:06:07Z"));

    // when
    const year = underTest.currentYear();

    // then
    expect(year).toBe(2031);

    vi.useRealTimers();
  });
});
