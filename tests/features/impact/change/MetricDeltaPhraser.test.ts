import { describe, expect, it } from "vitest";
import { MetricDelta } from "@app/feature/impact/change/MetricDelta";
import { MetricDeltaPhraser } from "@app/feature/impact/change/MetricDeltaPhraser";

describe("MetricDeltaPhraser", () => {
    const metricDeltaPhraser: MetricDeltaPhraser = new MetricDeltaPhraser();

    it("givenARise_whenPhrasing_thenTheWordTakesThePlaceOfTheSign", () => {
        expect(metricDeltaPhraser.phrase(new MetricDelta("+23%", "up", "on the 30 days before"))).toBe("up 23%");
    });

    it("givenAFall_whenPhrasing_thenTheWordTakesThePlaceOfTheSign", () => {
        expect(metricDeltaPhraser.phrase(new MetricDelta("−4%", "down", "on the 30 days before"))).toBe("down 4%");
    });
});
