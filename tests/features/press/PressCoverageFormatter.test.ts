import { describe, expect, it } from "vitest";
import { PressCoverageFormatter } from "@app/feature/press/service/PressCoverageFormatter";
import type { FeaturedPress } from "@app/feature/press/FeaturedPress";

const underTest: typeof PressCoverageFormatter = PressCoverageFormatter;

const feature = (publisherName: string, issueNumber: string): FeaturedPress =>
    ({
        publicationTitle: "A feature",
        summary: "A summary.",
        issueNumber,
        publisherName,
        publicationUrl: "https://example.com/a",
        softwareTitle: "Taskbook",
        softwareRepositoryUrl: "https://github.com/user/taskbook",
        hidden: false,
        order: 1,
    }) as FeaturedPress;

describe("PressCoverageFormatter.format", () => {
    it("givenSeveralFeatures_whenFormatting_thenTheWholeIsStatedInOneLine", () => {
        expect(
            underTest.format([
                feature("OMG Ubuntu", "08/2017"),
                feature("OMG Ubuntu", "08/2018"),
                feature("The Linux Magazine", "227/2019"),
            ])
        ).toBe("3 features, 2 publishers, 2017 to 2019");
    });

    it("givenOneYearOnly_whenFormatting_thenNoRangeIsClaimed", () => {
        expect(underTest.format([feature("GitHub", "01/2025")])).toBe("1 feature, 1 publisher, 2025");
    });

    it("givenIssuesThatStateNoYear_whenFormatting_thenOnlyTheCountsAreStated", () => {
        expect(underTest.format([feature("GitHub", "Spring edition")])).toBe("1 feature, 1 publisher");
    });

    it("givenNoFeatures_whenFormatting_thenNothingIsStated", () => {
        expect(underTest.format([])).toBeNull();
    });
});
