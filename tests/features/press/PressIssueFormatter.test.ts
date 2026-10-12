import { describe, expect, it } from "vitest";
import { PressIssueFormatter } from "@app/feature/press/service/PressIssueFormatter";

const underTest: typeof PressIssueFormatter = PressIssueFormatter;

describe("PressIssueFormatter.year", () => {
    it("givenAnIssueOfAMagazine_whenReading_thenTheYearIsTaken", () => {
        expect(underTest.year("227/2019")).toBe(2019);
    });

    it("givenAnIssueNumberedByMonth_whenReading_thenTheYearIsStillTaken", () => {
        expect(underTest.year("08/2018")).toBe(2018);
    });

    it("givenAYearAlone_whenReading_thenItIsTheYear", () => {
        expect(underTest.year("2025")).toBe(2025);
    });

    it("givenAnIssueThatStatesNoYear_whenReading_thenNothingIsClaimed", () => {
        expect(underTest.year("Spring edition")).toBeNull();
    });
});

describe("PressIssueFormatter.format", () => {
    it("givenAnIssue_whenFormatting_thenTheYearIsWritten", () => {
        expect(underTest.format("227/2019")).toBe("2019");
    });

    it("givenNoYear_whenFormatting_thenNothingIsWritten", () => {
        expect(underTest.format("Spring edition")).toBe("");
    });
});
