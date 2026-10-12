import { describe, expect, it } from "vitest";
import { MockImpactDataProvider } from "@app/feature/impact/service/MockImpactDataProvider";

import type { OutletDownloads } from "@app/feature/impact/OutletDownloads";
const underTest: MockImpactDataProvider = new MockImpactDataProvider();

describe("MockImpactDataProvider.provide", () => {
    it("givenNoNetwork_whenProviding_thenEveryWindowIsPopulated", async () => {
        const { periods } = await underTest.provide();

        expect(Object.keys(periods)).toEqual(["month", "quarter", "year", "all"]);
        expect(periods.all.downloads).toBeGreaterThan(periods.year.downloads);
    });

    it("givenNoNetwork_whenProviding_thenEachWindowCarriesItsOwnSeries", async () => {
        const { downloadTrend } = await underTest.provide();

        expect(downloadTrend.month).toHaveLength(30);
        expect(downloadTrend.quarter).toHaveLength(90);
        expect(downloadTrend.year).toHaveLength(365);
        expect(downloadTrend.all.length).toBeGreaterThan(12);
    });

    it("givenEachWindow_whenProviding_thenItsSeriesSumsToTheTotalItClaims", async () => {
        const { downloadTrend, outlets } = await underTest.provide();

        const npm: OutletDownloads | undefined = outlets.find(({ outlet }: OutletDownloads) => outlet === "npm");

        for (const window of ["month", "quarter", "year", "all"] as const) {
            const summed: number = downloadTrend[window].reduce((total: number, point: number) => total + point, 0);
            const claimed: number = npm?.[window] ?? 0;

            expect(Math.abs(summed - claimed)).toBeLessThan(claimed * 0.0001);
        }
    });

    it("givenOutletsWithGaps_whenProviding_thenUnreportableWindowsStayNull", async () => {
        const { outlets } = await underTest.provide();

        const github: OutletDownloads | undefined = outlets.find(({ outlet }: OutletDownloads) => outlet === "github");
        expect(github?.month).toBeNull();
        expect(github?.all).toBeGreaterThan(0);
    });

    it("givenNoNetwork_whenProviding_thenTrafficIsPresentSoTheLayoutCanBeSeen", async () => {
        const { traffic, snapshot } = await underTest.provide();

        expect(traffic).not.toBeNull();
        expect(snapshot.projects).toBeGreaterThan(0);
    });
});
