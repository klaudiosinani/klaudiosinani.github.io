import { describe, expect, it } from "vitest";
import type { EmploymentDuration } from "@app/feature/experience/EmploymentDuration";
import { EmploymentDurationFormatter } from "@app/feature/experience/service/EmploymentDurationFormatter";

const underTest: typeof EmploymentDurationFormatter = EmploymentDurationFormatter;

const TODAY: Date = new Date("2026-08-23T00:00:00Z");

describe("EmploymentDurationFormatter.format", () => {
    it("givenAPostThatEnded_whenMeasured_thenBothMonthsCount", () => {
        expect(underTest.format("2022-12", "2023-05", TODAY).length).toBe("6 mos");
    });

    it("givenAPostOfSeveralYears_whenMeasured_thenTheYearsAndMonthsAreStated", () => {
        expect(underTest.format("2023-06", "2025-09", TODAY).length).toBe("2 yrs 4 mos");
        expect(underTest.format("2021-10", "2022-12", TODAY).length).toBe("1 yr 3 mos");
    });

    it("givenAWholeNumberOfYears_whenMeasured_thenNoMonthsAreStated", () => {
        expect(underTest.format("2019-10", "2021-09", TODAY).length).toBe("2 yrs");
    });

    it("givenOneMonth_whenMeasured_thenTheWordIsSingular", () => {
        expect(underTest.format("2024-03", "2024-03", TODAY).length).toBe("1 mo");
    });

    it("givenAPostStillHeld_whenMeasured_thenItRunsToTheMonthOfTheBuild", () => {
        const held: EmploymentDuration = underTest.format("2025-11", null, TODAY);

        expect(held.getTo()).toBe("Present");
        expect(held.getCurrent()).toBe(true);
        expect(held.getLength()).toBe("10 mos");
    });

    it("givenAPostThatEnded_whenMeasured_thenItIsNotMarkedAsHeld", () => {
        expect(underTest.format("2019-10", "2021-09", TODAY).current).toBe(false);
    });

    it("givenTwoMonths_whenMeasured_thenTheyAreWrittenAsAReaderReadsThem", () => {
        const span: EmploymentDuration = underTest.format("2021-10", "2022-12", TODAY);

        expect(span.getFrom()).toBe("Oct 2021");
        expect(span.getTo()).toBe("Dec 2022");
    });

    it("givenTwoMonths_whenMeasured_thenTheMachineReadableOnesAreKept", () => {
        const span: EmploymentDuration = underTest.format("2021-10", "2022-12", TODAY);

        expect(span.getFromAt()).toBe("2021-10");
        expect(span.getToAt()).toBe("2022-12");
        expect(underTest.format("2025-11", null, TODAY).toAt).toBeNull();
    });
});

describe("EmploymentDurationFormatter.across", () => {
    it("givenSeveralPostsAtOneOrganisation_whenMeasured_thenTheWholeStayIsGiven", () => {
        const stay: EmploymentDuration = underTest.across(
            [
                { from: "2023-06", to: "2025-09" },
                { from: "2022-12", to: "2023-05" },
            ],
            TODAY
        );

        expect(stay.getFrom()).toBe("Dec 2022");
        expect(stay.getTo()).toBe("Sep 2025");
        expect(stay.getLength()).toBe("2 yrs 10 mos");
    });

    it("givenOneOfThePostsIsStillHeld_whenMeasured_thenTheStayIsToo", () => {
        const stay: EmploymentDuration = underTest.across(
            [
                { from: "2025-11", to: null },
                { from: "2024-01", to: "2025-10" },
            ],
            TODAY
        );

        expect(stay.getCurrent()).toBe(true);
        expect(stay.getTo()).toBe("Present");
        expect(stay.getFrom()).toBe("Jan 2024");
    });

    it("givenOnePost_whenMeasured_thenTheStayIsThatPost", () => {
        expect(underTest.across([{ from: "2019-10", to: "2021-09" }], TODAY).length).toBe("2 yrs");
    });
});
