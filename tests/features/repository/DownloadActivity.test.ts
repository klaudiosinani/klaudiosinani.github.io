import { describe, expect, it } from "vitest";
import { DownloadActivity } from "@app/feature/repository/DownloadActivity";

const underTest: typeof DownloadActivity = DownloadActivity;

const series = (counts: number[]): number[] => counts;

const year = (active: number): number[] =>
    Array.from({ length: 365 }, (_unused: unknown, day: number) => (day < active ? 5 : 0));

describe("DownloadActivity.isPlottable", () => {
    it("givenNoSeries_whenAsked_thenThereIsNothingToDraw", () => {
        expect(underTest.isPlottable([])).toBe(false);
    });

    it("givenABusyPackage_whenAsked_thenTheSeriesIsWorthDrawing", () => {
        const trend: number[] = year(365);

        expect(underTest.isPlottable(trend)).toBe(true);
    });

    it("givenAPackageWithAHandfulOfDownloadsAcrossTheYear_whenAsked_thenItIsRefused", () => {
        const trend: number[] = year(40);

        expect(underTest.isPlottable(trend)).toBe(false);
    });

    it("givenExactlyHalfTheDaysActive_whenAsked_thenItIsAcceptedAtTheBoundary", () => {
        const trend: number[] = series([1, 0, 2, 0]);

        expect(underTest.isPlottable(trend)).toBe(true);
    });

    it("givenJustUnderHalfTheDaysActive_whenAsked_thenItIsRefused", () => {
        const trend: number[] = series([1, 0, 0, 0]);

        expect(underTest.isPlottable(trend)).toBe(false);
    });

    it("givenASeriesOfZeroes_whenAsked_thenItIsRefused", () => {
        const trend: number[] = series([0, 0, 0]);

        expect(underTest.isPlottable(trend)).toBe(false);
    });
});
