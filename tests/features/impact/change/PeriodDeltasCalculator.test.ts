import { describe, expect, it } from "vitest";
import type { ImpactData } from "@app/feature/impact/ImpactData";
import type { PeriodMetrics } from "@app/feature/impact/PeriodMetrics";
import { PeriodDeltasCalculator } from "@app/feature/impact/change/PeriodDeltasCalculator";

import type { PeriodDeltas } from "@app/feature/impact/change/PeriodDeltas";
const underTest: typeof PeriodDeltasCalculator = PeriodDeltasCalculator;

const metrics = (overrides: Partial<PeriodMetrics> = {}): PeriodMetrics => ({
    downloads: 0,
    commits: 100,
    activeDays: null,
    releases: 10,
    pullRequestsOpened: 0,
    pullRequestsClosed: 0,
    issuesOpened: 0,
    issuesClosed: 0,
    ...overrides,
});

const impact = (previous: Partial<Record<string, PeriodMetrics | null>> = {}): ImpactData =>
    ({
        periods: {
            month: metrics(),
            quarter: metrics(),
            year: metrics(),
            all: metrics(),
        },
        previousPeriods: {
            month: null,
            quarter: null,
            year: null,
            all: null,
            ...previous,
        },
        downloadTrend: { month: [], quarter: [], year: [], all: [] },
    }) as unknown as ImpactData;

describe("PeriodDeltasCalculator.compute", () => {
    it("givenAPreviousWindow_whenResolving_thenEachRequestedMetricGetsAChange", () => {
        const data: ImpactData = impact({
            month: metrics({ commits: 80, releases: 8 }),
        });

        const deltas: PeriodDeltas = underTest.compute(data, ["commits", "releases"]);

        expect(deltas.month.commits?.getText()).toBe("+25%");
        expect(deltas.month.releases?.getText()).toBe("+25%");
    });

    it("givenNoPreviousWindow_whenResolving_thenEveryMetricIsNull", () => {
        const data: ImpactData = impact();

        const deltas: PeriodDeltas = underTest.compute(data, ["commits"]);

        expect(deltas.all.commits).toBeNull();
    });

    it("givenAMetricThatWasNotRequested_whenResolving_thenItIsAbsent", () => {
        const data: ImpactData = impact({ month: metrics({ commits: 80 }) });

        const deltas: PeriodDeltas = underTest.compute(data, ["commits"]);

        expect(deltas.month.issuesOpened).toBeUndefined();
    });

    it("givenDownloads_whenResolving_thenTheChangeComesFromTheDailySeries", () => {
        const data: ImpactData = {
            ...impact({ month: metrics({ downloads: 999 }) }),
            downloadTrend: {
                month: [],
                quarter: [],
                year: [...Array.from({ length: 335 }, () => 100), ...Array.from({ length: 30 }, () => 110)],
                all: [],
            },
        } as unknown as ImpactData;

        const deltas: PeriodDeltas = underTest.compute(data, ["commits"]);

        expect(deltas.month.downloads?.getText()).toBe("+10%");
    });

    it("givenAMetricThatIsNotAvailable_whenResolving_thenNoChangeIsClaimed", () => {
        const data: ImpactData = impact({ month: metrics({ activeDays: 40 }) });

        const deltas: PeriodDeltas = underTest.compute(data, ["activeDays"]);

        expect(deltas.month.activeDays).toBeNull();
    });
});
