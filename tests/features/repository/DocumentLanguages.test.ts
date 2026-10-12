import { describe, expect, it } from "vitest";
import { DocumentLanguages as underTest } from "@app/feature/repository/DocumentLanguages";

describe("DocumentLanguages.of", () => {
    it("givenTwoNamesForOneLanguage_whenAsked_thenBothGiveTheSameTag", () => {
        expect(underTest.of("GER")).toStrictEqual(underTest.of("de"));
        expect(underTest.of("RUS")).toStrictEqual(underTest.of("ru"));
        expect(underTest.of("ZH")).toStrictEqual(underTest.of("zh_CN"));
    });

    it("givenACountryName_whenAsked_thenItGivesTheLanguageOfThatCountry", () => {
        expect(underTest.of("AL")?.tag).toBe("sq");
        expect(underTest.of("AL")?.name).toBe("Shqip");
    });

    it("givenALanguageOfARegion_whenAsked_thenTheTagStatesTheRegion", () => {
        expect(underTest.of("PT-BR")?.tag).toBe("pt-BR");
        expect(underTest.of("PT-BR")?.slug).toBe("pt-br");
    });

    it("givenANameThatStatesNoLanguage_whenAsked_thenItGivesNothing", () => {
        expect(underTest.of("XX")).toBeNull();
    });
});

describe("DocumentLanguages.isEnglish", () => {
    it("givenTheNameOfTheLanguageOfTheSite_whenAsked_thenItSaysYes", () => {
        expect(underTest.isEnglish("EN")).toBe(true);
        expect(underTest.isEnglish("en")).toBe(true);
    });

    it("givenAnotherLanguage_whenAsked_thenItSaysNo", () => {
        expect(underTest.isEnglish("fr")).toBe(false);
    });

    it("givenTheSite_whenAskedForItsLanguage_thenItStatesEnglish", () => {
        expect(underTest.english).toBe("en");
    });
});
