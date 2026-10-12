import { describe, expect, it } from "vitest";
import { AUTHOR_EXPERTISE } from "@app/configuration/AuthorExpertise";

const underTest: readonly string[] = AUTHOR_EXPERTISE;

describe("AUTHOR_EXPERTISE", () => {
    it("givenTheFields_whenRead_thenEachOneIsATermAndNotASentence", () => {
        for (const field of underTest) {
            expect(field.trim()).toBe(field);
            expect(field.length).toBeGreaterThan(2);
            expect(field.length).toBeLessThanOrEqual(40);
            expect(field.endsWith(".")).toBe(false);
        }
    });

    it("givenTheFields_whenCompared_thenNoFieldIsStatedTwice", () => {
        expect(new Set(underTest).size).toBe(underTest.length);
    });

    it("givenTheFields_whenCounted_thenThereAreEnoughToDescribeTheWork", () => {
        expect(underTest.length).toBeGreaterThanOrEqual(5);
    });
});
