import { describe, expect, it } from "vitest";
import type { ImpactData } from "@app/feature/impact/ImpactData";
import { ImpactFigureFormatter } from "@ui/feature/impact/component/ImpactFigureFormatter";
import type { PeriodMetrics } from "@app/feature/impact/PeriodMetrics";

import type { PeriodFigures } from "@ui/feature/impact/component/PeriodFigures";
const underTest: typeof ImpactFigureFormatter = ImpactFigureFormatter;

const metrics = (overrides: Partial<PeriodMetrics> = {}): PeriodMetrics => ({
    downloads: 443290086,
    commits: 1200,
    activeDays: null,
    releases: 10,
    pullRequestsOpened: 4,
    pullRequestsClosed: 3,
    issuesOpened: 2,
    issuesClosed: 1,
    ...overrides,
});

const impact = (overrides: Partial<PeriodMetrics> = {}): ImpactData =>
    ({
        periods: {
            month: metrics(overrides),
            quarter: metrics(overrides),
            year: metrics(overrides),
            all: metrics(overrides),
        },
    }) as unknown as ImpactData;

describe("ImpactFigureFormatter.format", () => {
    it("givenACount_whenFormatted_thenBothTheShortAndTheFullFormAreReady", () => {
        const figures: PeriodFigures = underTest.format(impact());

        expect(figures.year.downloads.compact).toBe("443.3M");
        expect(figures.year.downloads.exact).toBe("443,290,086");
    });

    it("givenASmallCount_whenFormatted_thenTheShortFormKeepsEveryDigit", () => {
        const figures: PeriodFigures = underTest.format(impact());

        expect(figures.year.commits.compact).toBe("1,200");
    });

    it("givenEveryWindow_whenFormatted_thenEachOneCarriesItsOwnFigures", () => {
        const figures: PeriodFigures = underTest.format(impact());

        expect(Object.keys(figures)).toEqual(["month", "quarter", "year", "all"]);
    });

    it("givenAFigureTheBuildCouldNotCollect_whenFormatted_thenItIsLeftOut", () => {
        const data: ImpactData = impact({ commits: null as unknown as number });

        const figures: PeriodFigures = underTest.format(data);

        expect(figures.year.commits).toBeUndefined();
        expect(figures.year.releases).toBeDefined();
    });

    it("givenTheBlockOfFigures_whenFormatted_thenTheDownloadsAreIncluded", () => {
        const figures: PeriodFigures = underTest.format(impact());

        expect(figures.all.downloads).toBeDefined();
    });
});
