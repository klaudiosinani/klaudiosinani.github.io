import { describe, expect, it } from "vitest";
import { CodeSegmenter } from "@app/feature/contribution/service/CodeSegmenter";
import type { TextSegment } from "@app/feature/contribution/TextSegment";

const underTest: typeof CodeSegmenter = CodeSegmenter;

describe("CodeSegmenter.segment", () => {
    it("givenASentenceWithNoCode_whenSegmented_thenItIsOnePieceOfWords", () => {
        expect(underTest.segment("Fix reported code smells")).toEqual([
            { text: "Fix reported code smells", code: false },
        ]);
    });

    it("givenCodeInsideASentence_whenSegmented_thenTheThreePiecesStandApart", () => {
        const segments: TextSegment[] = underTest.segment(
            "Minor improvements on `RulesSeverityDetectorTest` test class"
        );

        expect(segments).toEqual([
            { text: "Minor improvements on ", code: false },
            { text: "RulesSeverityDetectorTest", code: true },
            { text: " test class", code: false },
        ]);
    });

    it("givenTwoPiecesOfCode_whenSegmented_thenBothAreMarked", () => {
        const segments: TextSegment[] = underTest.segment("Update `guava` to version `31.0.1`");

        expect(segments.filter(({ code }: TextSegment) => code)).toEqual([
            { text: "guava", code: true },
            { text: "31.0.1", code: true },
        ]);
    });

    it("givenASentenceThatBeginsAndEndsWithCode_whenSegmented_thenNoEmptyPieceIsMade", () => {
        const segments: TextSegment[] = underTest.segment("`first` and `second`");

        expect(segments).toEqual([
            { text: "first", code: true },
            { text: " and ", code: false },
            { text: "second", code: true },
        ]);
    });

    it("givenOneMarkAlone_whenSegmented_thenTheSentenceKeepsIt", () => {
        expect(underTest.segment("The ` mark")).toEqual([{ text: "The ` mark", code: false }]);
    });

    it("givenAnEmptySentence_whenSegmented_thenNothingIsDrawn", () => {
        expect(underTest.segment("")).toEqual([]);
    });
});
