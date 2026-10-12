import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { AUTHOR_EMPLOYER } from "@app/configuration/AuthorEmployer";
import type { Experience } from "@app/configuration/Experience";
import { EXPERIENCE } from "@app/configuration/Experience";
import type { ExperienceRole } from "@app/configuration/ExperienceRole";

const underTest: readonly Experience[] = EXPERIENCE;

const MONTH: RegExp = /^\d{4}-(0[1-9]|1[0-2])$/;

const roles = (): ExperienceRole[] => underTest.flatMap(({ roles: held }: Experience) => [...held]);

describe("EXPERIENCE", () => {
    it("givenEveryMonth_whenRead_thenItIsStatedInTheOneShape", () => {
        for (const { title, from, to } of roles()) {
            expect(from, title).toMatch(MONTH);

            if (to !== null) {
                expect(to, title).toMatch(MONTH);
            }
        }
    });

    it("givenEveryPost_whenRead_thenItEndsAfterItBegan", () => {
        for (const { title, from, to } of roles()) {
            if (to !== null) {
                expect(to >= from, title).toBe(true);
            }
        }
    });

    it("givenTheRecord_whenRead_thenOnlyOnePostIsStillHeld", () => {
        expect(roles().filter(({ to }: ExperienceRole) => to === null)).toHaveLength(1);
    });

    it("givenThePostStillHeld_whenRead_thenItIsAtTheStatedEmployer", () => {
        const now: Experience | undefined = underTest.find(({ roles: held }: Experience) =>
            held.some(({ to }: ExperienceRole) => to === null)
        );

        expect(now?.organisation).toBe(AUTHOR_EMPLOYER.name);
    });

    it("givenTheRecord_whenRead_thenTheNewestStayComesFirst", () => {
        const starts: string[] = underTest.map(
            ({ roles: held }: Experience) => [...held].map(({ from }: ExperienceRole) => from).sort()[0]
        );

        expect([...starts].sort().reverse()).toEqual(starts);
    });

    it("givenEveryStay_whenRead_thenItStatesWhereAndOnWhatTerms", () => {
        for (const { organisation, location, commitment, roles: held } of underTest) {
            expect(organisation.length, organisation).toBeGreaterThan(1);
            expect(location, organisation).toMatch(/, /);
            expect(commitment.length, organisation).toBeGreaterThan(3);
            expect(held.length, organisation).toBeGreaterThan(0);
        }
    });

    it("givenEveryStay_whenRead_thenItsMarkIsHeldInThisRepository", () => {
        for (const { organisation, mark } of underTest) {
            expect(mark, organisation).toMatch(/^\/experience\/[a-z-]+\.jpg$/);
            expect(existsSync(`public${mark}`), organisation).toBe(true);
        }
    });

    it("givenAStayThatNamesAPageOfThisSite_whenRead_thenTheAddressIsOneOfThisSite", () => {
        for (const { organisation, page } of underTest) {
            if (page) {
                expect(page.href, organisation).toMatch(/^\/[a-z0-9/-]*\/$/);
                expect(page.label.length, organisation).toBeGreaterThan(3);
            }
        }
    });
});
