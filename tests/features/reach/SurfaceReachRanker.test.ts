import { describe, expect, it } from "vitest";
import { SurfaceReach } from "@app/feature/reach/surface/SurfaceReach";
import { SurfaceReachRanker } from "@app/feature/reach/surface/SurfaceReachRanker";

describe("SurfaceReachRanker", () => {
    const surfaceReachRanker: SurfaceReachRanker = new SurfaceReachRanker();
    const surfaceOf = (name: string, stars: number | null, downloads: number | null): SurfaceReach =>
        new SurfaceReach(name, "", `/${name}/`, stars, downloads, null, null);

    it("givenProjects_whenRanking_thenTheMostStarredComesFirst", () => {
        const ranked: SurfaceReach[] = surfaceReachRanker.rank([
            surfaceOf("signale", 9_175, 472_844_920),
            surfaceOf("taskbook", 9_343, 34_440),
            surfaceOf("arare", 126, 3_780),
        ]);

        expect(ranked.map((surfaceReach: SurfaceReach) => surfaceReach.getName())).toEqual([
            "taskbook",
            "signale",
            "arare",
        ]);
    });

    it("givenEqualStars_whenRanking_thenTheMostDownloadedComesFirst", () => {
        const ranked: SurfaceReach[] = surfaceReachRanker.rank([
            surfaceOf("first", 10, 5),
            surfaceOf("second", 10, 50),
        ]);

        expect(ranked[0].getName()).toBe("second");
    });

    it("givenNoAnswerForStars_whenRanking_thenTheProjectComesLast", () => {
        const ranked: SurfaceReach[] = surfaceReachRanker.rank([
            surfaceOf("unknown", null, null),
            surfaceOf("known", 0, 0),
        ]);

        expect(ranked[0].getName()).toBe("known");
    });
});
