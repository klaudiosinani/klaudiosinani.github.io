import { describe, expect, it } from "vitest";
import { LanguageColorResolver } from "@app/util/language/LanguageColorResolver";

const underTest: typeof LanguageColorResolver = LanguageColorResolver;

describe("LanguageColorResolver.resolve", () => {
    it("givenALanguage_whenResolving_thenItsColorIsGiven", () => {
        expect(underTest.resolve("JavaScript")).toBe("#f1e05a");
        expect(underTest.resolve("TypeScript")).toBe("#3178c6");
    });

    it("givenALanguageInAnotherCase_whenResolving_thenTheColorIsStillFound", () => {
        expect(underTest.resolve("PYTHON")).toBe(underTest.resolve("Python"));
    });

    it("givenALanguageThatIsNotInTheList_whenResolving_thenThereIsNoColor", () => {
        expect(underTest.resolve("Brainfuck")).toBeNull();
    });
});
