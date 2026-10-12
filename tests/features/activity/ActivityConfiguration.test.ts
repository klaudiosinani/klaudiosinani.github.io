import { describe, expect, it } from "vitest";
import { ActivityConfiguration } from "@app/feature/activity/ActivityConfiguration";

const underTest: typeof ActivityConfiguration = ActivityConfiguration;

describe("ActivityConfiguration", () => {
    it("givenTheTwoSurfaces_whenComparing_thenTheActivityPageShowsMoreThanTheHomePage", () => {
        expect(underTest.ENTRIES).toBeGreaterThan(underTest.ENTRIES_PER_INDEX);
    });

    it("givenOneBusyRepository_whenGathering_thenItAloneCanFillThePage", () => {
        expect(underTest.PER_REPOSITORY).toBeGreaterThanOrEqual(underTest.ENTRIES);
    });

    it("givenTheTimeline_whenGathering_thenSeveralRepositoriesFeedIt", () => {
        expect(underTest.REPOSITORIES).toBeGreaterThan(1);
    });
});
