import { describe, expect, it } from "vitest";
import { ReleaseSummaryFormatter } from "@app/feature/repository/service/ReleaseSummaryFormatter";

const underTest: typeof ReleaseSummaryFormatter = ReleaseSummaryFormatter;

describe("ReleaseSummaryFormatter.words", () => {
    it("givenNotesInMarkdown_whenReadingTheWords_thenTheMarksAreLeftOut", () => {
        expect(underTest.words("## Highlights\n\n- Adds a `scope` option\n")).toBe("Highlights Adds a scope option");
    });

    it("givenALink_whenReadingTheWords_thenTheWordsOfItAreKept", () => {
        expect(underTest.words("See the [migration notes](https://x.com).")).toBe("See the migration notes.");
    });

    it("givenAFencedBlock_whenReadingTheWords_thenTheCodeIsLeftOut", () => {
        expect(underTest.words("Try it.\n\n```js\nconst a = 1;\n```\n")).toBe("Try it.");
    });
});

describe("ReleaseSummaryFormatter.format", () => {
    it("givenNotesThatFit_whenFormatting_thenTheyAreReturnedWhole", () => {
        expect(underTest.format("A small fix.", 80)).toBe("A small fix.");
    });

    it("givenNotesThatOverrun_whenFormatting_thenTheCutIsMadeAtAWord", () => {
        const summary: string = underTest.format(
            "Adds a scope option to every interactive logger, and restores colour",
            40
        );

        expect(summary.length).toBeLessThanOrEqual(40);
        expect(summary.endsWith("…")).toBe(true);
        expect(summary).not.toContain("interactiv…");
    });

    it("givenOneWordLongerThanTheRoom_whenFormatting_thenTheWordItselfIsCut", () => {
        const summary: string = underTest.format("A".repeat(80), 30);

        expect(summary.length).toBeLessThanOrEqual(30);
        expect(summary.endsWith("…")).toBe(true);
    });

    it("givenAWordThatFillsAlmostAllTheRoom_whenFormatting_thenTheCutHoldsTheWords", () => {
        const summary: string = underTest.format(`Short ${"A".repeat(60)}`, 30);

        expect(summary.length).toBeLessThanOrEqual(30);
        expect(summary.startsWith("Short A")).toBe(true);
    });

    it("givenNoNotes_whenFormatting_thenNothingIsReturned", () => {
        expect(underTest.format("   ", 80)).toBe("");
    });
});
