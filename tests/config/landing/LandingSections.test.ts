import { describe, expect, it } from "vitest";
import type { LandingSection } from "@app/configuration/landing/LandingSection";
import { LANDING_SECTIONS } from "@app/configuration/landing/LandingSections";

describe("LANDING_SECTIONS", () => {
    it("givenTheLandingPage_whenReadInOrder_thenActivityLeadsAndTheOutletsClose", () => {
        expect(LANDING_SECTIONS.map((landingSection: LandingSection) => landingSection.getKey())).toEqual([
            "activity",
            "open-source",
            "publications",
            "organizations",
            "featured",
        ]);
    });

    it("givenASectionWithALink_whenRead_thenTheLinkEndsWithASlashAndHasAName", () => {
        LANDING_SECTIONS.filter((landingSection: LandingSection) => landingSection.getHref() !== null).forEach(
            (landingSection: LandingSection) => {
                expect(landingSection.getHref()?.endsWith("/")).toBe(true);
                expect(landingSection.getMore()).not.toBeNull();
            }
        );
    });
});
