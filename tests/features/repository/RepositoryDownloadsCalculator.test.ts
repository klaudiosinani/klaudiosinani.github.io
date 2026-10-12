import { describe, expect, it } from "vitest";
import { RepositoryDownloadsCalculator } from "@app/feature/repository/service/RepositoryDownloadsCalculator";

import type { RepositoryDownloads } from "@app/feature/repository/RepositoryDownloads";
const underTest: typeof RepositoryDownloadsCalculator = RepositoryDownloadsCalculator;

describe("RepositoryDownloadsCalculator.compute", () => {
    it("givenSeveralSources_whenAdding_thenTheFigureHoldsEveryOne", () => {
        const downloads: RepositoryDownloads = underTest.compute([
            { label: "npm", value: 41_900_000 },
            { label: "GitHub releases", value: 48_941 },
        ]);

        expect(downloads.total).toBe(41_948_941);
        expect(downloads.sources).toEqual(["npm", "GitHub releases"]);
    });

    it("givenOneSourceAlone_whenAdding_thenOnlyThatOneIsNamed", () => {
        expect(
            underTest.compute([
                { label: "npm", value: 12 },
                { label: "GitHub releases", value: 0 },
            ])
        ).toEqual({ total: 12, sources: ["npm"], caveats: [] });
    });

    it("givenASourceThatPublishesNoCount_whenAdding_thenItAddsNothing", () => {
        expect(
            underTest.compute([
                { label: "npm", value: null },
                { label: "GitHub releases", value: 500 },
            ])
        ).toEqual({ total: 500, sources: ["GitHub releases"], caveats: [] });
    });

    it("givenNoSourceWithACount_whenAdding_thenThereIsNoFigureAtAll", () => {
        expect(
            underTest.compute([
                { label: "npm", value: null },
                { label: "GitHub releases", value: 0 },
            ])
        ).toEqual({ total: null, sources: [], caveats: [] });
    });

    it("givenASourceThatHoldsNoFullRecord_whenAdding_thenItSaysWhatItCounts", () => {
        const downloads: RepositoryDownloads = underTest.compute([
            { label: "npm", value: 10 },
            {
                label: "Snap",
                value: 4,
                note: "Snap gives the devices that hold it now",
            },
        ]);

        expect(downloads.total).toBe(14);
        expect(downloads.caveats).toEqual(["Snap gives the devices that hold it now"]);
    });

    it("givenASourceWithACaveatButNoCount_whenAdding_thenTheCaveatIsLeftOut", () => {
        expect(
            underTest.compute([
                { label: "npm", value: 10 },
                { label: "Snap", value: null, note: "Snap counts devices" },
            ]).caveats
        ).toEqual([]);
    });

    it("givenNothingToAdd_whenAdding_thenThereIsNoFigure", () => {
        expect(underTest.compute([])).toEqual({
            total: null,
            sources: [],
            caveats: [],
        });
    });
});
