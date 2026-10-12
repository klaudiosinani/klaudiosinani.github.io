import { describe, expect, it } from "vitest";
import { ContributionConfiguration } from "@app/feature/contribution/ContributionConfiguration";

const underTest: typeof ContributionConfiguration = ContributionConfiguration;

describe("ContributionConfiguration.PER_PAGE", () => {
    it("givenAPageOfCommits_whenCounted_thenItHoldsEnoughToBeWorthAPage", () => {
        expect(underTest.PER_PAGE).toBeGreaterThanOrEqual(10);
    });

    it("givenTheRecordOfSonarQube_whenPaged_thenItRunsToAFewPagesAndNotToMany", () => {
        expect(Math.ceil(60 / underTest.PER_PAGE)).toBeLessThanOrEqual(4);
    });
});
