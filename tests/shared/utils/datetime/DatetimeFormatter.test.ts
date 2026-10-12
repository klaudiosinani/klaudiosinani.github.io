import { describe, expect, it } from "vitest";
import { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter";

const underTest: typeof DatetimeFormatter = DatetimeFormatter;

describe("DatetimeFormatter.date", () => {
    it("givenAnIsoString_whenFormattingTheDate_thenItReadsInTheConfiguredLocale", () => {
        const value: string = "2026-08-07T09:30:00Z";

        const formatted: string = underTest.formatDate(value);

        expect(formatted).toBe("Aug 7, 2026");
    });

    it("givenADateInstance_whenFormattingTheDate_thenItReadsInTheConfiguredLocale", () => {
        const value: Date = new Date("2024-10-01T16:50:00Z");

        const formatted: string = underTest.formatDate(value);

        expect(formatted).toBe("Oct 1, 2024");
    });
});

describe("DatetimeFormatter.time", () => {
    it("givenAMorningIsoString_whenFormattingTheTime_thenItReadsAsAm", () => {
        const value: string = "2026-08-07T09:30:00Z";

        const formatted: string = underTest.formatTime(value);

        expect(formatted).toBe("09:30 AM");
    });

    it("givenAnAfternoonDateInstance_whenFormattingTheTime_thenItReadsAsPm", () => {
        const value: Date = new Date("2024-10-01T16:50:00Z");

        const formatted: string = underTest.formatTime(value);

        expect(formatted).toBe("04:50 PM");
    });
});
