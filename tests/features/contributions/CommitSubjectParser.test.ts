import { describe, expect, it } from "vitest";
import type { CommitSubject } from "@app/feature/contribution/CommitSubject";
import { CommitSubjectParser } from "@app/feature/contribution/service/CommitSubjectParser";

const underTest: typeof CommitSubjectParser = CommitSubjectParser;

describe("CommitSubjectParser.parse", () => {
    it("givenAMessageThatBeginsWithATicket_whenParsed_thenTheTwoPartsStandApart", () => {
        const parsed: CommitSubject = underTest.parse("SONAR-17645 Enable SCIM feature toggling mechanism");

        expect(parsed).toEqual({
            ticket: "SONAR-17645",
            subject: "Enable SCIM feature toggling mechanism",
        });
    });

    it("givenATicketOfAnotherTeam_whenParsed_thenItIsReadAsATicketToo", () => {
        const parsed: CommitSubject = underTest.parse("MMF-2692 Initial git blame command implementation");

        expect(parsed.ticket).toBe("MMF-2692");
    });

    it("givenADashAfterTheTicket_whenParsed_thenTheSubjectBeginsAtTheWords", () => {
        const parsed: CommitSubject = underTest.parse("SONAR-15631 - Refactor UTs to stop using ExpectedException");

        expect(parsed.subject).toBe("Refactor UTs to stop using ExpectedException");
    });

    it("givenATicketInBrackets_whenParsed_thenTheBracketsAreNotPartOfIt", () => {
        const parsed: CommitSubject = underTest.parse("[SONAR-100] Fix the thing");

        expect(parsed).toEqual({ ticket: "SONAR-100", subject: "Fix the thing" });
    });

    it("givenTheMarkForNoTicket_whenParsed_thenNoTicketIsReadAndTheMarkIsDropped", () => {
        const parsed: CommitSubject = underTest.parse("[NO-JIRA] Fix reported code smells");

        expect(parsed).toEqual({
            ticket: null,
            subject: "Fix reported code smells",
        });
    });

    it("givenAMessageWithNoTicket_whenParsed_thenTheWholeLineIsTheSubject", () => {
        const parsed: CommitSubject = underTest.parse(
            "Update backend dependency `com.google.guava` to new major version"
        );

        expect(parsed).toEqual({
            ticket: null,
            subject: "Update backend dependency `com.google.guava` to new major version",
        });
    });

    it("givenAMessageWithABody_whenParsed_thenOnlyTheFirstLineIsRead", () => {
        const parsed: CommitSubject = underTest.parse(
            "SONAR-1 Add the thing\n\nThe body states why, over several lines."
        );

        expect(parsed.subject).toBe("Add the thing");
    });

    it("givenAnEmptyMessage_whenParsed_thenNothingIsRead", () => {
        expect(underTest.parse("")).toEqual({ ticket: null, subject: "" });
    });
});
