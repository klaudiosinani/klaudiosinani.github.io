import { describe, expect, it } from "vitest";
import { ReadingTimeResolver } from "@app/feature/publication/service/ReadingTimeResolver";

const underTest: typeof ReadingTimeResolver = ReadingTimeResolver;

const words = (count: number): string => Array.from({ length: count }, () => "word").join(" ");

describe("ReadingTimeResolver.minutes", () => {
    it("givenATypicalArticle_whenEstimating_thenItIsCountedAtTheConventionalPace", () => {
        expect(underTest.minutes(words(1000))).toBe(5);
    });

    it("givenAShortNote_whenEstimating_thenItStillTakesAMinute", () => {
        expect(underTest.minutes(words(12))).toBe(1);
    });

    it("givenAnEmptyBody_whenEstimating_thenTheFloorStillHolds", () => {
        expect(underTest.minutes("   ")).toBe(1);
    });

    it("givenIrregularWhitespace_whenEstimating_thenItDoesNotInflateTheCount", () => {
        expect(underTest.minutes("one\n\n  two\t\tthree   four")).toBe(1);
    });
});
