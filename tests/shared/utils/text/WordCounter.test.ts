import { describe, expect, it } from "vitest";
import { WordCounter } from "@app/util/text/WordCounter";

const underTest: typeof WordCounter = WordCounter;

describe("WordCounter.count", () => {
    it("givenASentence_whenCounting_thenEachWordIsCountedOnce", () => {
        expect(underTest.count("The work of one person.")).toBe(5);
    });

    it("givenTextBrokenOverLines_whenCounting_thenTheBreaksAreNotWords", () => {
        expect(underTest.count("  one\n\ntwo\tthree   four ")).toBe(4);
    });

    it("givenNothingAtAll_whenCounting_thenTheCountIsNothing", () => {
        expect(underTest.count("   ")).toBe(0);
    });
});
