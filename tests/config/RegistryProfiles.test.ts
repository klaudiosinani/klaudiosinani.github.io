import { describe, expect, it } from "vitest";
import { AuthorProfiles } from "@app/configuration/AuthorProfiles";
import type { RegistryProfile } from "@app/configuration/RegistryProfile";
import { REGISTRY_PROFILES } from "@app/configuration/RegistryProfiles";

const underTest: readonly RegistryProfile[] = REGISTRY_PROFILES;

describe("REGISTRY_PROFILES", () => {
    it("givenEveryRegistry_whenRead_thenTheRecordOfThePersonNamesItToo", () => {
        for (const { href, name } of underTest) {
            expect(AuthorProfiles.ALL, name).toContain(href);
        }
    });

    it("givenEveryRegistry_whenRead_thenItLeadsAwayFromThisSite", () => {
        for (const { href, name } of underTest) {
            expect(href, name).toMatch(/^https:\/\//);
        }
    });

    it("givenEveryRegistry_whenRead_thenItStatesWhatAReaderWillFind", () => {
        for (const { title, name } of underTest) {
            expect(title.length, name).toBeGreaterThan(8);
        }
    });

    it("givenTheRegistries_whenRead_thenNoneIsNamedTwice", () => {
        const names: string[] = underTest.map(({ name }: RegistryProfile) => name);

        expect(new Set(names).size).toBe(names.length);
    });
});
