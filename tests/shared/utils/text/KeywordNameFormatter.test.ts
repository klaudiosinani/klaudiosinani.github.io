import { describe, expect, it } from "vitest";
import { KeywordNameFormatter } from "@app/util/text/KeywordNameFormatter";

const underTest: typeof KeywordNameFormatter = KeywordNameFormatter;

describe("KeywordNameFormatter.format", () => {
    it("givenAKeywordThatCarriesItsOwnCapitals_whenFormatting_thenTheyAreKept", () => {
        expect(underTest.format("typescript")).toBe("TypeScript");
    });

    it("givenAKeywordOfSeveralWords_whenFormatting_thenTheNameIsWrittenInFull", () => {
        expect(underTest.format("stream-api")).toBe("Stream API");
    });

    it("givenASubject_whenFormatting_thenItIsWrittenAsASentence", () => {
        expect(underTest.format("best-practice")).toBe("Best practice");
    });

    it("givenOneWord_whenFormatting_thenItIsCapitalised", () => {
        expect(underTest.format("extension")).toBe("Extension");
    });
});
