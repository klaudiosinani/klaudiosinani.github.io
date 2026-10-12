import { describe, expect, it } from "vitest";
import type { DownloadTotals } from "@app/infrastructure/registry/npm/domain/DownloadTotals";
import type { OutletDownloads } from "@app/feature/impact/OutletDownloads";
import { OutletDownloadsFactory } from "@app/feature/impact/aggregation/OutletDownloadsFactory";

const underTest: typeof OutletDownloadsFactory = OutletDownloadsFactory;

const npm: DownloadTotals = {
    month: 10,
    quarter: 20,
    year: 30,
    all: 40,
} as unknown as DownloadTotals;

const sourced: OutletDownloads[] = [{ outlet: "pypi", month: 5, quarter: null, year: null, all: null }];

describe("OutletDownloadsFactory.create", () => {
    it("givenEveryGatheredPart_whenCreating_thenEachOutletKeepsItsOwnWindows", () => {
        const outlets: OutletDownloads[] = underTest.create(npm, { downloads: 900 }, sourced);

        expect(outlets.map(({ outlet }: OutletDownloads) => outlet)).toEqual(["npm", "github", "pypi"]);
        expect(outlets[0]).toEqual({ outlet: "npm", ...npm });
    });

    it("givenReleaseAssets_whenCreating_thenTheyReportTheAllTimeWindowOnly", () => {
        const outlets: OutletDownloads[] = underTest.create(npm, { downloads: 900 }, []);

        expect(outlets[1]).toEqual({
            outlet: "github",
            month: null,
            quarter: null,
            year: null,
            all: 900,
        });
    });
});
