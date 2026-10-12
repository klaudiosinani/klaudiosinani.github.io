import { describe, expect, it } from "vitest";
import { SPONSOR_LINK } from "@app/configuration/SponsorLink";
import type { SponsorLink } from "@app/configuration/SponsorLink";

const underTest: SponsorLink = SPONSOR_LINK;

describe("SPONSOR_LINK", () => {
    it("givenTheInvitation_whenRead_thenItLeadsToTheSponsorsPageOfTheAccount", () => {
        expect(underTest.href).toBe("https://github.com/sponsors/klaudiosinani");
    });

    it("givenTheControl_whenRead_thenItStatesWhatItDoes", () => {
        expect(underTest.label).toBe("Sponsor");
        expect(underTest.title.length).toBeGreaterThan(underTest.label.length);
    });
});
