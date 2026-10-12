import { describe, expect, it } from "vitest";
import type { ImpactData } from "@app/feature/impact/ImpactData";
import { StandingClusterFactory } from "@ui/feature/impact/component/StandingClusterFactory";

import type { StandingCluster } from "@ui/feature/impact/component/StandingCluster";
import type { StandingFigure } from "@ui/feature/impact/component/StandingFigure";
const underTest: typeof StandingClusterFactory = StandingClusterFactory;

const impact = (overrides: Partial<ImpactData> = {}): ImpactData =>
    ({
        periods: { all: { downloads: 900 } },
        snapshot: {
            stars: 30000,
            forks: 1500,
            projects: 40,
            openPullRequests: 3,
            openIssues: 12,
        },
        traffic: { views: 100, uniqueVisitors: 50, clones: 70 },
        installedBase: 250,
        ...overrides,
    }) as unknown as ImpactData;

const labels = (data: ImpactData, name: string): string[] =>
    underTest
        .create(data)
        .filter((cluster: StandingCluster) => cluster.name === name)
        .flatMap((cluster: StandingCluster) => cluster.figures.map((figure: StandingFigure) => figure.label));

describe("StandingClusterFactory.create", () => {
    it("givenEverySource_whenResolving_thenTheFiguresFallIntoThreeGroups", () => {
        expect(underTest.create(impact()).map((cluster: StandingCluster) => cluster.name)).toEqual([
            "Community",
            "Adoption",
            "Maintenance",
        ]);
    });

    it("givenEveryFigure_whenResolving_thenEachOneCarriesAnIconAndACount", () => {
        for (const cluster of underTest.create(impact())) {
            for (const item of cluster.figures) {
                expect(item.icon).toBeTypeOf("function");
                expect(item.value).toBeTypeOf("number");
                expect(item.label.length).toBeGreaterThan(0);
            }
        }
    });

    it("givenATrafficToken_whenResolving_thenTheClonesAreShown", () => {
        expect(labels(impact(), "Adoption")).toContain("git clones");
    });

    it("givenNoTrafficToken_whenResolving_thenTheClonesAreLeftOut", () => {
        const data: ImpactData = impact({ traffic: null });

        expect(labels(data, "Adoption")).not.toContain("git clones");
    });

    it("givenNoPublisherCredentials_whenResolving_thenTheInstallationsAreLeftOut", () => {
        const data: ImpactData = impact({ installedBase: null });

        expect(labels(data, "Adoption")).not.toContain("installations");
    });

    it("givenNoOptionalSource_whenResolving_thenTheGroupsThatRemainAreNotEmpty", () => {
        const data: ImpactData = impact({ traffic: null, installedBase: null });

        const clusters: StandingCluster[] = underTest.create(data);

        for (const cluster of clusters) {
            expect(cluster.figures.length).toBeGreaterThan(0);
        }

        expect(labels(data, "Adoption")).toEqual(["downloads"]);
    });
});
