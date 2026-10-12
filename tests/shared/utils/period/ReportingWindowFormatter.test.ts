import { describe, expect, it } from "vitest";
import { ReportingWindowFormatter } from "@app/util/period/ReportingWindowFormatter";

const underTest: typeof ReportingWindowFormatter = ReportingWindowFormatter;

const END: Date = new Date("2026-08-20T00:00:00Z");

describe("ReportingWindowFormatter.between", () => {
    it("givenBothEnds_whenFormatting_thenTheWindowIsStated", () => {
        expect(underTest.between(new Date("2026-07-21T00:00:00Z"), END)).toBe("Jul 21, 2026 to Aug 20, 2026");
    });

    it("givenNoStart_whenFormatting_thenOnlyTheEndIsStated", () => {
        expect(underTest.between(null, END)).toBe("to Aug 20, 2026");
    });

    it("givenAStartThatIsNotBeforeTheEnd_whenFormatting_thenOnlyTheEndIsStated", () => {
        expect(underTest.between(END, END)).toBe("to Aug 20, 2026");
    });
});
