import { describe, expect, it } from "vitest";
import { ReleaseSlugFormatter } from "@app/feature/repository/service/ReleaseSlugFormatter";

const underTest: typeof ReleaseSlugFormatter = ReleaseSlugFormatter;

describe("ReleaseSlugFormatter.format", () => {
    it("givenAVersionTag_whenFormatting_thenTheDigitsAndTheDotsAreKept", () => {
        expect(underTest.format("v4.2.0")).toBe("v4.2.0");
    });

    it("givenATagInCapitals_whenFormatting_thenItIsLowered", () => {
        expect(underTest.format("V1.0.0")).toBe("v1.0.0");
    });

    it("givenATagWithWordsInIt_whenFormatting_thenTheSpacesBecomeHyphens", () => {
        expect(underTest.format("2.0.0 beta 1")).toBe("2.0.0-beta-1");
    });

    it("givenATagWithCharactersAPathCannotHold_whenFormatting_thenTheyAreReplaced", () => {
        expect(underTest.format("@scope/pkg@1.2.3")).toBe("scope-pkg-1.2.3");
    });
});

describe("ReleaseSlugFormatter.isReserved", () => {
    it("givenATagNamedAfterTheStableAddress_whenChecked_thenItIsReserved", () => {
        expect(underTest.isReserved("latest")).toBe(true);
        expect(underTest.isReserved("Latest")).toBe(true);
    });

    it("givenAVersionTag_whenChecked_thenItIsFree", () => {
        expect(underTest.isReserved("v4.2.0")).toBe(false);
    });
});
