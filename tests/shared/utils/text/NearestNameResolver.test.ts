import { describe, expect, it } from "vitest";
import { NearestNameResolver } from "@app/util/text/NearestNameResolver";

const underTest: typeof NearestNameResolver = NearestNameResolver;

const NAMES: string[] = ["taskbook", "signale", "tusk", "qoa"];

describe("NearestNameResolver.resolve", () => {
    it("givenAMistypedName_whenResolving_thenTheNameItNearlyIsIsGiven", () => {
        expect(underTest.resolve("taskboo", NAMES)).toBe("taskbook");
    });

    it("givenTheNameItself_whenResolving_thenItIsTheNearest", () => {
        expect(underTest.resolve("Signale", NAMES)).toBe("signale");
    });

    it("givenAWordThatIsNoName_whenResolving_thenNothingIsGuessed", () => {
        expect(underTest.resolve("documentation", NAMES)).toBeNull();
    });

    it("givenNothing_whenResolving_thenNothingIsGuessed", () => {
        expect(underTest.resolve("", NAMES)).toBeNull();
    });

    it("givenNoNames_whenResolving_thenNothingIsGuessed", () => {
        expect(underTest.resolve("taskbook", [])).toBeNull();
    });
});
