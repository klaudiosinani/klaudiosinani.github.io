import { describe, expect, it } from "vitest";
import { RepositoryTrailFactory } from "@app/feature/repository/factory/RepositoryTrailFactory";
import type { TrailStep } from "@app/util/routing/TrailStep";

const underTest: typeof RepositoryTrailFactory = RepositoryTrailFactory;

describe("RepositoryTrailFactory.create", () => {
    it("givenAProject_whenTheTrailIsMade_thenItStartsAtTheSoftwareListing", () => {
        const trail: TrailStep[] = underTest.create("Signale.js", "signale");

        expect(trail).toEqual([
            { name: "Software", href: "/software/" },
            { name: "Signale.js", href: "/signale/" },
        ]);
    });

    it("givenAPageUnderTheProject_whenTheTrailIsMade_thenItIsTheLastStep", () => {
        const trail: TrailStep[] = underTest.create("Signale.js", "signale", {
            name: "Releases",
            href: "/signale/releases/",
        });

        expect(trail).toHaveLength(3);
        expect(trail[2]).toEqual({ name: "Releases", href: "/signale/releases/" });
    });

    it("givenTwoStepsBelow_whenTheTrailIsMade_thenTheyKeepTheirOrder", () => {
        const trail: TrailStep[] = underTest.create(
            "Signale.js",
            "signale",
            { name: "Documentation", href: "/signale/documentation/" },
            { name: "日本語", href: "/signale/documentation/ja/" }
        );

        expect(trail.map(({ name }: TrailStep) => name)).toEqual(["Software", "Signale.js", "Documentation", "日本語"]);
    });
});
