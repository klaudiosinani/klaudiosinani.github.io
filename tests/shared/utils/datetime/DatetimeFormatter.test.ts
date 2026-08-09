import { describe, expect, it } from "vitest";
import { DatetimeFormatter } from "@utils/datetime/DatetimeFormatter";

const underTest = DatetimeFormatter;

describe("DatetimeFormatter.date", () => {
  it("givenAnIsoString_whenFormattingTheDate_thenItReadsInTheConfiguredLocale", () => {
    // given
    const value = "2026-08-07T09:30:00Z";

    // when
    const formatted = underTest.formatDate(value);

    // then
    expect(formatted).toBe("Aug 7, 2026");
  });

  it("givenADateInstance_whenFormattingTheDate_thenItReadsInTheConfiguredLocale", () => {
    // given
    const value = new Date("2024-10-01T16:50:00Z");

    // when
    const formatted = underTest.formatDate(value);

    // then
    expect(formatted).toBe("Oct 1, 2024");
  });
});

describe("DatetimeFormatter.time", () => {
  it("givenAMorningIsoString_whenFormattingTheTime_thenItReadsAsAm", () => {
    // given
    const value = "2026-08-07T09:30:00Z";

    // when
    const formatted = underTest.formatTime(value);

    // then
    expect(formatted).toBe("09:30 AM");
  });

  it("givenAnAfternoonDateInstance_whenFormattingTheTime_thenItReadsAsPm", () => {
    // given
    const value = new Date("2024-10-01T16:50:00Z");

    // when
    const formatted = underTest.formatTime(value);

    // then
    expect(formatted).toBe("04:50 PM");
  });
});
