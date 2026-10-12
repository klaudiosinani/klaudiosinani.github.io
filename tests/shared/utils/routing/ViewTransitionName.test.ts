import { describe, expect, it } from "vitest";
import { ViewTransitionName } from "@app/util/routing/ViewTransitionName";

const underTest: typeof ViewTransitionName = ViewTransitionName;

describe("ViewTransitionName.of", () => {
    it("givenAName_whenNamed_thenTheKindStandsInFrontOfTheSlug", () => {
        expect(underTest.of("software", "Signale.js")).toBe("software-signale-js");
    });

    it("givenANameThatStartsWithADigit_whenNamed_thenTheIdentifierIsStillValid", () => {
        expect(underTest.of("publication", "3 Things")).toBe("publication-3-things");
        expect(underTest.of("publication", "3 Things")).toMatch(/^[a-z]/);
    });

    it("givenOneNameUnderTwoKinds_whenNamed_thenTheTwoDoNotCollide", () => {
        expect(underTest.of("software", "Singlie")).not.toBe(underTest.of("publication", "Singlie"));
    });

    it("givenAccentsAndPunctuation_whenNamed_thenTheyBecomePlainLetters", () => {
        expect(underTest.of("release", "v4.2.0")).toBe("release-v-4-2-0");
    });
});
