import { describe, expect, it } from "vitest";
import { SharePercentageFormatter as underTest } from "@ui/feature/impact/component/SharePercentageFormatter";

describe("SharePercentageFormatter.format", () => {
    it("givenAWholeShare_whenFormatting_thenItStatesOneHundred", () => {
        expect(underTest.format(1)).toBe("100%");
    });

    it("givenAShareOfNothing_whenFormatting_thenItStatesZero", () => {
        expect(underTest.format(0)).toBe("0%");
    });

    it("givenAShareBelowOnePercent_whenFormatting_thenItStatesLessThanOne", () => {
        const share: number = 105 / 12_900_000;

        expect(underTest.format(share)).toBe("<1%");
    });

    it("givenAShareJustBelowOnePercent_whenFormatting_thenItStatesLessThanOne", () => {
        expect(underTest.format(0.00999)).toBe("<1%");
    });

    it("givenAnOrdinaryShare_whenFormatting_thenItRoundsToTheNearestPercent", () => {
        expect(underTest.format(0.274)).toBe("27%");
    });
});
