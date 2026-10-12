import { describe, expect, it } from "vitest";
import { DependentCounts } from "@app/feature/repository/signal/DependentCounts";
import { PackageListing } from "@app/feature/repository/package/PackageListing";
import { PartnerConfiguration } from "@app/feature/partner/PartnerConfiguration";
import { PlacementsFactory } from "@app/feature/partner/placement/PlacementsFactory";
import { ReachFixture } from "../reach/ReachFixture";
import { RepositoryProfileFixture } from "../reach/RepositoryProfileFixture";
import type { SurfaceReach } from "@app/feature/reach/surface/SurfaceReach";
import { SurfaceReachFactory } from "@app/feature/reach/surface/SurfaceReachFactory";

describe("PlacementsFactory", () => {
    const placementsFactory: PlacementsFactory = new PlacementsFactory(
        new PartnerConfiguration(),
        new SurfaceReachFactory()
    );
    const repositoryProfileFixture: RepositoryProfileFixture = new RepositoryProfileFixture();
    const reachFixture: ReachFixture = new ReachFixture();

    it("givenAReadmeOnNpm_whenCreating_thenTheReadmeNamesBothPlaces", () => {
        const placements: SurfaceReach[] = placementsFactory.create(
            [
                repositoryProfileFixture.create(472_844_920, new DependentCounts(155_132, 0), [
                    new PackageListing("npm", "npm", "https://www.npmjs.com/package/signale", "1.4.0"),
                ]),
            ],
            reachFixture.create(155_132, 2_771)
        );

        expect(placements[0].getName()).toBe("The readme of signale");
        expect(placements[0].getNote()).toBe("On GitHub, and on its page on npm");
        expect(placements[0].getDependentRepositories()).toBe(155_132);
    });

    it("givenAReadmeOffNpm_whenCreating_thenTheReadmeNamesGitHubAlone", () => {
        const placements: SurfaceReach[] = placementsFactory.create(
            [repositoryProfileFixture.create(null, null, [])],
            reachFixture.create(155_132, 2_771)
        );

        expect(placements[0].getNote()).toBe("On GitHub");
    });

    it("givenAnyReadmes_whenCreating_thenTheProfileComesLastWithItsStarsAlone", () => {
        const placements: SurfaceReach[] = placementsFactory.create([], reachFixture.create(155_132, 2_771));
        const profile: SurfaceReach = placements[placements.length - 1];

        expect(profile.getName()).toBe("The GitHub profile");
        expect(profile.getNote()).toBe("github.com/klaudiosinani, with 31 repositories");
        expect(profile.getHref()).toBe("https://github.com/klaudiosinani");
        expect(profile.getStars()).toBe(29_378);
        expect(profile.getDownloads()).toBeNull();
        expect(profile.getDependentRepositories()).toBeNull();
    });
});
