import { describe, expect, it } from "vitest";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import { RepositoryDownloadChart } from "@app/feature/repository/RepositoryDownloadChart";

const underTest: typeof RepositoryDownloadChart = RepositoryDownloadChart;

const profile = (total: number | null, trend: number[]): Pick<RepositoryProfile, "downloads" | "trend"> => ({
    downloads: { total, sources: [], caveats: [] },
    trend,
});

describe("RepositoryDownloadChart.drawable", () => {
    it("givenACountAndASeries_whenAsked_thenTheCurveCanBeDrawn", () => {
        expect(underTest.drawable(profile(100, [1, 2, 3]) as RepositoryProfile)).toBe(true);
    });

    it("givenNoCount_whenAsked_thenNothingIsDrawn", () => {
        expect(underTest.drawable(profile(null, [1, 2]) as RepositoryProfile)).toBe(false);
    });

    it("givenAnEmptySeries_whenAsked_thenNothingIsDrawn", () => {
        expect(underTest.drawable(profile(100, []) as RepositoryProfile)).toBe(false);
    });
});
