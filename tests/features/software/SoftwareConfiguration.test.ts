import { describe, expect, it } from "vitest";
import { SoftwareConfiguration } from "@app/feature/software/SoftwareConfiguration";

const underTest: typeof SoftwareConfiguration = SoftwareConfiguration;

describe("SoftwareConfiguration.PER_INDEX", () => {
    it("givenTheHomePageGrid_whenCountingCards_thenTheCountIsEvenSoNoTileIsOrphaned", () => {
        expect(underTest.PER_INDEX % 2).toBe(0);
        expect(underTest.PER_INDEX).toBeGreaterThan(0);
    });
});

describe("SoftwareConfiguration.PER_ARCHIVE_PAGE", () => {
    it("givenTheArchive_whenPaged_thenAPageEndsOnAFullRowOfTheGrid", () => {
        expect(underTest.PER_ARCHIVE_PAGE % 2).toBe(0);
    });

    it("givenTheArchive_whenPaged_thenItHoldsMoreThanTheLandingPageShows", () => {
        expect(underTest.PER_ARCHIVE_PAGE).toBeGreaterThan(underTest.PER_INDEX);
    });
});
