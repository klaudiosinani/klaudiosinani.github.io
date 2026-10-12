import { describe, expect, it } from "vitest";
import type { Sponsor } from "@app/configuration/Sponsor";
import { SPONSORS } from "@app/configuration/Sponsors";

const underTest: readonly Sponsor[] = SPONSORS;

describe("SPONSORS", () => {
    it("givenEverySponsor_whenRead_thenEachStatesOneStateOnly", () => {
        const names: string[] = underTest.map(({ name }: Sponsor) => name);

        expect(new Set(names).size).toBe(names.length);
    });

    it("givenEverySponsor_whenRead_thenTheirMarkIsHeldHere", () => {
        for (const { name, mark } of underTest) {
            expect(mark, name).toMatch(/^\/sponsors\/[a-z0-9-]+\.png$/);
        }
    });

    it("givenTheSponsorsNow_whenRead_thenAtLeastOneIsCurrent", () => {
        expect(underTest.some(({ current }: Sponsor) => current)).toBe(true);
    });
});
