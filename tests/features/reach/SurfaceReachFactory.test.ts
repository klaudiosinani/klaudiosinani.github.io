import { describe, expect, it } from "vitest";
import { DependentCounts } from "@app/feature/repository/signal/DependentCounts";
import { RepositoryProfileFixture } from "./RepositoryProfileFixture";
import type { SurfaceReach } from "@app/feature/reach/surface/SurfaceReach";
import { SurfaceReachFactory } from "@app/feature/reach/surface/SurfaceReachFactory";

describe("SurfaceReachFactory", () => {
    const surfaceReachFactory: SurfaceReachFactory = new SurfaceReachFactory();
    const repositoryProfileFixture: RepositoryProfileFixture = new RepositoryProfileFixture();

    it("givenEveryFigure_whenCreating_thenTheReachHoldsEachFigure", () => {
        const surfaceReach: SurfaceReach = surfaceReachFactory.create(
            repositoryProfileFixture.create(472_844_920, new DependentCounts(155_132, 0), []),
            "The readme of signale",
            "On GitHub",
            "https://github.com/klaudiosinani/signale"
        );

        expect(surfaceReach.getName()).toBe("The readme of signale");
        expect(surfaceReach.getNote()).toBe("On GitHub");
        expect(surfaceReach.getHref()).toBe("https://github.com/klaudiosinani/signale");
        expect(surfaceReach.getStars()).toBe(9_175);
        expect(surfaceReach.getDownloads()).toBe(472_844_920);
        expect(surfaceReach.getDependentRepositories()).toBe(155_132);
    });

    it("givenNoDependents_whenCreating_thenTheReachHoldsNoDependents", () => {
        const surfaceReach: SurfaceReach = surfaceReachFactory.create(
            repositoryProfileFixture.create(472_844_920, null, []),
            "signale",
            "",
            "/signale/"
        );

        expect(surfaceReach.getDependentRepositories()).toBeNull();
    });

    it("givenNoDownloadsCounted_whenCreating_thenTheReachHoldsNoDownloads", () => {
        const surfaceReach: SurfaceReach = surfaceReachFactory.create(
            repositoryProfileFixture.create(0, new DependentCounts(0, 0), []),
            "signale",
            "",
            "/signale/"
        );

        expect(surfaceReach.getDownloads()).toBeNull();
        expect(surfaceReach.getDependentRepositories()).toBeNull();
    });

    it("givenNoAnswerForDownloads_whenCreating_thenTheReachHoldsNoDownloads", () => {
        const surfaceReach: SurfaceReach = surfaceReachFactory.create(
            repositoryProfileFixture.create(null, null, []),
            "signale",
            "",
            "/signale/"
        );

        expect(surfaceReach.getDownloads()).toBeNull();
    });

    it("givenFewDependents_whenCreating_thenTheFigureIsTooSmallToShow", () => {
        const surfaceReach: SurfaceReach = surfaceReachFactory.create(
            repositoryProfileFixture.create(34_440, new DependentCounts(18, 0), []),
            "taskbook",
            "",
            "/taskbook/"
        );

        expect(surfaceReach.getDependentRepositories()).toBeNull();
        expect(surfaceReach.getDownloads()).toBe(34_440);
    });
});
