import { describe, expect, it } from "vitest";
import { NumberFormatter } from "@app/util/text/NumberFormatter";

const underTest: typeof NumberFormatter = NumberFormatter;

describe("NumberFormatter.compact", () => {
    it("givenAFigureInTheHundredsOfMillions_whenFormattingCompactly_thenItStaysLegible", () => {
        const downloads: number = 443_290_086;

        const formatted: string = underTest.compact(downloads);

        expect(formatted).toBe("443.3M");
    });

    it("givenAFigureInTheMillions_whenFormattingCompactly_thenOneDecimalIsKept", () => {
        const formatted: string = underTest.compact(12_494_108);

        expect(formatted).toBe("12.5M");
    });

    it("givenASmallFigure_whenFormattingCompactly_thenItIsLeftIntact", () => {
        const formatted: string = underTest.compact(82);

        expect(formatted).toBe("82");
    });

    it("givenZero_whenFormattingCompactly_thenItReadsAsZero", () => {
        const formatted: string = underTest.compact(0);

        expect(formatted).toBe("0");
    });
});

describe("NumberFormatter.exact", () => {
    it("givenALargeFigure_whenFormattingExactly_thenItIsGrouped", () => {
        const formatted: string = underTest.exact(443_290_086);

        expect(formatted).toBe("443,290,086");
    });

    it("givenACompactedFigure_whenFormattingExactly_thenNoPrecisionIsLost", () => {
        const downloads: number = 126_649_292;

        const formatted: string = underTest.exact(downloads);

        expect(formatted).toBe("126,649,292");
        expect(underTest.compact(downloads)).toBe("126.6M");
    });
});

describe("NumberFormatter.display", () => {
    it("givenAFigureThatReadsAtAGlance_whenDisplaying_thenItIsGroupedInFull", () => {
        const formatted: string = underTest.display(29_367);

        expect(formatted).toBe("29,367");
    });

    it("givenAFigureTooLongToRead_whenDisplaying_thenItIsShortened", () => {
        const formatted: string = underTest.display(126_649_292);

        expect(formatted).toBe("126.6M");
    });

    it("givenAFigureAtTheThreshold_whenDisplaying_thenItIsShortened", () => {
        const formatted: string = underTest.display(100_000);

        expect(formatted).toBe("100K");
    });

    it("givenAFigureJustBelowTheThreshold_whenDisplaying_thenItIsGrouped", () => {
        const formatted: string = underTest.display(99_999);

        expect(formatted).toBe("99,999");
    });

    it("givenASmallFigure_whenDisplaying_thenItIsLeftIntact", () => {
        const formatted: string = underTest.display(6);

        expect(formatted).toBe("6");
    });
});

describe("NumberFormatter.share", () => {
    it("givenAPartOfAWhole_whenFormatting_thenItIsReadAsAPercentage", () => {
        expect(underTest.share(0.729)).toBe("72.9%");
    });

    it("givenAWholeShare_whenFormatting_thenNoDecimalIsAdded", () => {
        expect(underTest.share(1)).toBe("100%");
    });

    it("givenNothingAtAll_whenFormatting_thenItIsStatedAsNothing", () => {
        expect(underTest.share(0)).toBe("0%");
    });

    it("givenAVerySmallShare_whenFormatting_thenItIsNotRoundedAwayToNothing", () => {
        expect(underTest.share(0.0004)).toBe("<0.1%");
    });
});
