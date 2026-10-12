import { describe, expect, it } from "vitest";
import { MetricDeltaPhraser } from "@app/feature/impact/change/MetricDeltaPhraser";
import { NumberFormatter } from "@app/util/text/NumberFormatter";
import { ReachConfiguration } from "@app/feature/reach/ReachConfiguration";
import { ReachFixture } from "./ReachFixture";
import { ReachPhraser } from "@app/feature/reach/ReachPhraser";

describe("ReachPhraser", () => {
    const reachPhraser: ReachPhraser = new ReachPhraser(
        new NumberFormatter(),
        new MetricDeltaPhraser(),
        new ReachConfiguration()
    );
    const reachFixture: ReachFixture = new ReachFixture();

    it("givenAMonthWithAChange_whenPhrasing_thenTheChangeFollowsTheFigure", () => {
        expect(reachPhraser.lastMonth(reachFixture.create(155_132, 2_771))).toBe(
            "15,344,148 downloads in 30 days, up 23%"
        );
    });

    it("givenTheRecord_whenPhrasing_thenTheFirstYearIsNamed", () => {
        expect(reachPhraser.allTime(reachFixture.create(155_132, 2_771))).toBe("474,691,029 downloads since 2018");
    });

    it("givenDependentRepositories_whenPhrasing_thenTheProjectsAreNamed", () => {
        expect(reachPhraser.dependents(reachFixture.create(155_132, 2_771))).toBe(
            "155,132 repositories depend on my projects"
        );
    });

    it("givenNoAnswerForDependents_whenPhrasing_thenNoLineIsWritten", () => {
        expect(reachPhraser.dependents(reachFixture.create(null, 2_771))).toBeNull();
    });

    it("givenNoViews_whenPhrasing_thenNoLineIsWritten", () => {
        expect(reachPhraser.views(reachFixture.create(155_132, 0))).toBeNull();
        expect(reachPhraser.views(reachFixture.create(155_132, null))).toBeNull();
    });
});
