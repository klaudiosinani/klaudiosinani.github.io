import { describe, expect, it } from "vitest";
import { CommitMessage } from "@app/util/text/CommitMessage";

const underTest: typeof CommitMessage = CommitMessage;

describe("CommitMessage.subject", () => {
    it("givenAMessageWithABody_whenReadingTheSubject_thenTheFirstLineAlone", () => {
        expect(underTest.subject("Add the thing\n\nThe body states why it was added.")).toBe("Add the thing");
    });

    it("givenAMessageOfOneLine_whenReadingTheSubject_thenItIsTheWholeMessage", () => {
        expect(underTest.subject("Fix reported code smells")).toBe("Fix reported code smells");
    });

    it("givenSpacesAroundTheSubject_whenRead_thenTheyAreNotPartOfIt", () => {
        expect(underTest.subject("  Fix the thing  \nbody")).toBe("Fix the thing");
    });

    it("givenAnEmptyMessage_whenRead_thenNothingIsStated", () => {
        expect(underTest.subject("")).toBe("");
    });
});
