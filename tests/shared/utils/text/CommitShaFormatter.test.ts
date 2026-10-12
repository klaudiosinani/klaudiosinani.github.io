import { describe, expect, it } from "vitest";
import { CommitShaFormatter } from "@app/util/text/CommitShaFormatter";

const underTest: typeof CommitShaFormatter = CommitShaFormatter;

describe("CommitShaFormatter.format", () => {
    it("givenAFullHash_whenFormatting_thenTheFirstSevenCharactersAreKept", () => {
        expect(underTest.format("9f2c1ab8e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9")).toBe("9f2c1ab");
    });

    it("givenAHashThatIsAlreadyShort_whenFormatting_thenItDoesNotChange", () => {
        expect(underTest.format("1a2b3c")).toBe("1a2b3c");
    });
});
