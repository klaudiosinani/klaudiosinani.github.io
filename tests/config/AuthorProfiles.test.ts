import { describe, expect, it } from "vitest";
import { AuthorProfiles } from "@app/configuration/AuthorProfiles";
import { SOCIAL_LINKS } from "@app/configuration/SocialLinks";

import type { SocialLink } from "@app/configuration/SocialLink";
const underTest: readonly string[] = AuthorProfiles.ALL;

describe("AuthorProfiles.ALL", () => {
    it("givenEveryProfile_whenRead_thenItIsAnAddressOfItsOwn", () => {
        for (const profile of underTest) {
            expect(() => new URL(profile)).not.toThrow();
            expect(profile.startsWith("https://")).toBe(true);
        }
    });

    it("givenTheAccountsOfTheFooter_whenListed_thenEachOneIsAmongTheProfiles", () => {
        const linked: string[] = SOCIAL_LINKS.filter(
            ({ active, href }: SocialLink) => active && href.startsWith("http")
        ).map(({ href }: SocialLink) => href);

        for (const href of linked) {
            expect(underTest).toContain(href);
        }
    });

    it("givenTheRegistriesThatServeTheWork_whenListed_thenTheyAreAmongTheProfiles", () => {
        expect(underTest).toContain("https://www.npmjs.com/~klaudiosinani");
        expect(underTest).toContain("https://snapcraft.io/publisher/klaudiosinani");
    });

    it("givenTheProfiles_whenCompared_thenNoAddressIsNamedTwice", () => {
        expect(new Set(underTest).size).toBe(underTest.length);
    });
});
