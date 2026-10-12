import { describe, expect, it } from "vitest";
import type { Sponsor } from "@app/configuration/Sponsor";
import { SponsorRoll } from "@app/configuration/SponsorRoll";
import { SPONSORS } from "@app/configuration/Sponsors";

const underTest: typeof SponsorRoll = SponsorRoll;

describe("SponsorRoll", () => {
    it("givenTheRoll_whenAskedWhoSupportsTheWorkNow_thenOnlyThoseWhoDoAreNamed", () => {
        const named: Sponsor[] = underTest.current();

        expect(named.every(({ current }: Sponsor) => current)).toBe(true);
    });

    it("givenTheRoll_whenAskedWhoSupportedItBefore_thenOnlyThoseWhoDidAreNamed", () => {
        expect(underTest.past().every(({ current }: Sponsor) => !current)).toBe(true);
    });

    it("givenTheRoll_whenBothAreTaken_thenEverySponsorStandsInOneOfThem", () => {
        expect(underTest.current().length + underTest.past().length).toBe(SPONSORS.length);
    });
});
