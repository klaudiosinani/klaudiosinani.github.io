import { describe, expect, it } from "vitest";
import { OrdinalIndexFormatter } from "@app/util/text/OrdinalIndexFormatter";

describe("OrdinalIndexFormatter", () => {
    const ordinalIndexFormatter: OrdinalIndexFormatter = new OrdinalIndexFormatter();

    it("givenTheFirstPosition_whenFormatting_thenItReadsOne", () => {
        expect(ordinalIndexFormatter.format(0)).toBe("01");
    });

    it("givenATwoDigitPosition_whenFormatting_thenNoZeroLeads", () => {
        expect(ordinalIndexFormatter.format(11)).toBe("12");
    });
});
