import { describe, expect, it } from "vitest";
import type { DownloadShare } from "@ui/feature/impact/component/DownloadShare";
import { DownloadShareCalculator } from "@ui/feature/impact/component/DownloadShareCalculator";
import type { OutletDownloads } from "@app/feature/impact/OutletDownloads";

const underTest: typeof DownloadShareCalculator = DownloadShareCalculator;

const downloads = (outlet: OutletDownloads["outlet"], all: number | null): OutletDownloads => ({
    outlet,
    month: null,
    quarter: null,
    year: null,
    all,
});

describe("DownloadShareCalculator.compute", () => {
    it("givenSeveralOutlets_whenComputing_thenTheLargestLeadsAndTheSharesAddToOne", () => {
        const shares: DownloadShare[] = underTest.compute([downloads("pypi", 250), downloads("npm", 750)], "all");

        expect(shares.map(({ name }: DownloadShare) => name)).toEqual(["npm", "PyPI"]);
        expect(shares.map(({ share }: DownloadShare) => share)).toEqual([0.75, 0.25]);
    });

    it("givenAnOutletThatDidNotAnswer_whenComputing_thenItIsAbsent", () => {
        expect(
            underTest
                .compute([downloads("npm", 10), downloads("homebrew", null)], "all")
                .map(({ outlet }: DownloadShare) => outlet)
        ).toEqual(["npm"]);
    });

    it("givenAnOutletWithNoDownloads_whenComputing_thenItIsAbsent", () => {
        expect(
            underTest
                .compute([downloads("npm", 10), downloads("github", 0)], "all")
                .map(({ outlet }: DownloadShare) => outlet)
        ).toEqual(["npm"]);
    });

    it("givenTwoOutletsOfOneSize_whenComputing_thenTheirNamesOrderThem", () => {
        expect(
            underTest
                .compute([downloads("pypi", 10), downloads("npm", 10)], "all")
                .map(({ name }: DownloadShare) => name)
        ).toEqual(["npm", "PyPI"]);
    });

    it("givenNoDownloadsAtAll_whenComputing_thenThereIsNothingToDraw", () => {
        expect(underTest.compute([downloads("npm", null)], "all")).toEqual([]);
    });

    it("givenAWindow_whenComputing_thenOnlyThatWindowIsCounted", () => {
        expect(
            underTest.compute([{ outlet: "npm", month: 5, quarter: 50, year: 500, all: 5000 }], "quarter")[0].value
        ).toBe(50);
    });
});
