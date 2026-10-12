import { describe, expect, it } from "vitest";
import { CountFormatter } from "@app/util/text/CountFormatter";

const underTest: typeof CountFormatter = CountFormatter;

describe("CountFormatter.of", () => {
    it("givenOneOfSomething_whenWritten_thenTheNounIsSingular", () => {
        expect(underTest.of(1, "release")).toBe("1 release");
    });

    it("givenSeveralOfSomething_whenWritten_thenTheNounIsPlural", () => {
        expect(underTest.of(4, "release")).toBe("4 releases");
    });

    it("givenNoneOfSomething_whenWritten_thenTheNounIsPlural", () => {
        expect(underTest.of(0, "commit")).toBe("0 commits");
    });
});
