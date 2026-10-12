import { describe, expect, it } from "vitest";
import type { Experience } from "@app/configuration/Experience";
import type { ExperienceStay, HeldPost } from "@app/feature/experience/ExperienceStay";
import { ExperienceStayFactory } from "@app/feature/experience/factory/ExperienceStayFactory";

const underTest: typeof ExperienceStayFactory = ExperienceStayFactory;

const TODAY: Date = new Date("2026-08-01T00:00:00Z");

const stay = (...months: [string, string | null][]): Experience => ({
    organisation: "Sonar",
    mark: "/media/sonar.jpg",
    location: "Geneva, Switzerland",
    commitment: "Full time",
    roles: months.map(([from, to]: [string, string | null], at: number) => ({
        title: `Post ${at + 1}`,
        from,
        to,
    })),
});

describe("ExperienceStayFactory.create", () => {
    it("givenAStayOfOnePost_whenCreated_thenTheStayAndThePostSpanTheSameMonths", () => {
        const [held]: ExperienceStay[] = underTest.create([stay(["2021-10", "2022-12"])], TODAY);

        expect(held.getSpan().getLength()).toBe(held.getPosts()[0].getSpan().getLength());
        expect(held.getPosts()).toHaveLength(1);
    });

    it("givenAStayOfTwoPosts_whenCreated_thenTheStayCoversBothOfThem", () => {
        const [held]: ExperienceStay[] = underTest.create(
            [stay(["2022-12", "2023-05"], ["2023-06", "2025-09"])],
            TODAY
        );

        expect(held.getPosts().map(({ role }: HeldPost) => role.title)).toEqual(["Post 1", "Post 2"]);
        expect(held.getSpan().getFrom()).toBe(held.getPosts()[0].getSpan().getFrom());
    });

    it("givenAPostStillHeld_whenCreated_thenItIsMeasuredAgainstTheDayItIsRead", () => {
        const [held]: ExperienceStay[] = underTest.create([stay(["2025-11", null])], TODAY);

        expect(held.getSpan().getLength()).toContain("mos");
    });

    it("givenNoRecord_whenCreated_thenNoStayIsDrawn", () => {
        expect(underTest.create([], TODAY)).toEqual([]);
    });
});
