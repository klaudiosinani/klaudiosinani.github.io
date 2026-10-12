import { describe, expect, it } from "vitest";
import type { ContributedRepository } from "@app/configuration/ContributedRepository";
import { CONTRIBUTED_REPOSITORIES } from "@app/configuration/ContributedRepositories";

const underTest: readonly ContributedRepository[] = CONTRIBUTED_REPOSITORIES;

describe("CONTRIBUTED_REPOSITORIES", () => {
    it("givenTheRecord_whenRead_thenItNamesAtLeastOneCodebase", () => {
        expect(underTest.length).toBeGreaterThan(0);
    });

    it("givenEveryEntry_whenRead_thenItStatesWhereTheCommitsAreRead", () => {
        for (const { owner, name, url } of underTest) {
            expect(owner.length, name).toBeGreaterThan(0);
            expect(name, name).toMatch(/^[a-z0-9-]+$/);
            expect(url, name).toBe(`https://github.com/${owner}/${name}`);
        }
    });

    it("givenEveryEntry_whenRead_thenItStatesWhatTheSoftwareIsAndWhatIDid", () => {
        for (const { title, summary, role } of underTest) {
            expect(title.length, title).toBeGreaterThan(1);
            expect(summary, title).toMatch(/\.$/);
            expect(role, title).toMatch(/\.$/);
        }
    });

    it("givenTheRecord_whenRead_thenNoCodebaseIsNamedTwice", () => {
        const paths: string[] = underTest.map(({ owner, name }: ContributedRepository) => `${owner}/${name}`);

        expect(new Set(paths).size).toBe(paths.length);
    });
});
