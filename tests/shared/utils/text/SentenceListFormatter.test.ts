import { describe, expect, it } from "vitest";
import { SentenceListFormatter } from "@app/util/text/SentenceListFormatter";

describe("SentenceListFormatter", () => {
    const sentenceListFormatter: SentenceListFormatter = new SentenceListFormatter();

    it("givenTheFields_whenFormatting_thenEachTakesCapitalsAndADotStandsBetween", () => {
        expect(
            sentenceListFormatter.format([
                "software engineering",
                "open source software",
                "software design & architecture",
                "computer science",
            ])
        ).toBe("Software Engineering · Open Source Software · Software Design & Architecture · Computer Science");
    });

    it("givenAFieldOfSeveralWords_whenFormatting_thenOnlyTheSpaceAfterADotMayBreakTheLine", () => {
        const breaks: string[] = sentenceListFormatter
            .format(["software design & architecture", "computer science"])
            .split(" ");

        expect(breaks).toEqual(["Software Design & Architecture ·", "Computer Science"]);
    });

    it("givenAWordWithItsOwnCapitals_whenFormatting_thenTheyAreKept", () => {
        expect(sentenceListFormatter.format(["node.js and JavaScript"])).toBe("Node.js and JavaScript");
    });

    it("givenAnEmptyField_whenFormatting_thenItLeavesNoGap", () => {
        expect(sentenceListFormatter.format(["data structures", " ", "books"])).toBe("Data Structures · Books");
    });
});
