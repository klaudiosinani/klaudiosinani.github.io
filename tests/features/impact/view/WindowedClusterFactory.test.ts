import { describe, expect, it } from "vitest";
import type { ImpactFigure } from "@ui/feature/impact/component/ImpactFigure";
import { WindowedClusterFactory } from "@ui/feature/impact/component/WindowedClusterFactory";
import { WindowedMetrics } from "@ui/feature/impact/component/WindowedMetrics";

import type { WindowedMetric } from "@ui/feature/impact/component/WindowedMetric";
import type { WindowedCluster } from "@ui/feature/impact/component/WindowedCluster";
const underTest: typeof WindowedClusterFactory = WindowedClusterFactory;

const figure: ImpactFigure = { compact: "1", exact: "1" };

const figures = (...keys: string[]): Record<string, ImpactFigure> =>
    Object.fromEntries(keys.map((key: string) => [key, figure]));

const all: Record<string, ImpactFigure> = figures(...WindowedMetrics.ALL.map(({ key }: WindowedMetric) => key));

describe("WindowedClusterFactory.create", () => {
    it("givenEveryFigure_whenGrouping_thenNoneIsLostAndNoneIsRepeated", () => {
        const grouped: WindowedMetric[] = underTest.create(all).flatMap(({ metrics }: WindowedCluster) => metrics);

        expect(grouped.map(({ key }: WindowedMetric) => key).sort()).toEqual(
            WindowedMetrics.ALL.map(({ key }: WindowedMetric) => key).sort()
        );
    });

    it("givenEveryFigure_whenGrouping_thenEachGroupIsNamed", () => {
        for (const cluster of underTest.create(all)) {
            expect(cluster.name.length).toBeGreaterThan(0);
            expect(cluster.metrics.length).toBeGreaterThan(0);
        }
    });

    it("givenEveryFigure_whenGrouping_thenWhatWasShippedComesFirst", () => {
        expect(underTest.create(all)[0].metrics[0].key).toBe("commits");
    });

    it("givenAFigureThatIsAbsent_whenGrouping_thenOnlyTheOthersAreKept", () => {
        const [delivery] = underTest.create(figures("commits"));

        expect(delivery.metrics.map(({ key }: WindowedMetric) => key)).toEqual(["commits"]);
    });

    it("givenAGroupWithNoFigure_whenGrouping_thenTheGroupIsLeftOut", () => {
        const clusters: WindowedCluster[] = underTest.create(figures("issuesClosed"));

        expect(clusters).toHaveLength(1);
        expect(clusters[0].name).toBe("Issues");
    });

    it("givenNoFigure_whenGrouping_thenThereIsNothingToShow", () => {
        expect(underTest.create({})).toEqual([]);
    });
});
