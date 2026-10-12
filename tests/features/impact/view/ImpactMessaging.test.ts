import { describe, expect, it } from "vitest";
import { ImpactMessaging } from "@ui/feature/impact/component/ImpactMessaging";

const underTest: typeof ImpactMessaging = ImpactMessaging;

describe("ImpactMessaging.SUMMARY", () => {
    it("givenAFirstTimeVisitor_whenReadingTheSummary_thenItNamesTheSubjectRatherThanOnlyTheAbstraction", () => {
        expect(underTest.SUMMARY.toLowerCase()).toContain("open source");
        expect(underTest.SUMMARY).toMatch(/\bmy\b/i);
        expect(underTest.SUMMARY.endsWith(".")).toBe(true);
    });
});

describe("ImpactMessaging block labels", () => {
    it("givenTheTwoBlocks_whenLabelled_thenEachStatesItsScopeAndTheyDiffer", () => {
        expect(underTest.WINDOWED).not.toBe(underTest.STANDING);
        expect(underTest.WINDOWED.length).toBeGreaterThan(0);
        expect(underTest.STANDING.length).toBeGreaterThan(0);
    });
});
