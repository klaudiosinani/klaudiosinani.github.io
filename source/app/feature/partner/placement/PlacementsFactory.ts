import type { PartnerConfiguration } from "../PartnerConfiguration";
import type { PackageListing } from "@app/feature/repository/package/PackageListing";
import type { Reach } from "@app/feature/reach/Reach";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";
import { SurfaceReach } from "@app/feature/reach/surface/SurfaceReach";
import type { SurfaceReachFactory } from "@app/feature/reach/surface/SurfaceReachFactory";

export class PlacementsFactory {
    private readonly partnerConfiguration: PartnerConfiguration;
    private readonly surfaceReachFactory: SurfaceReachFactory;

    public constructor(partnerConfiguration: PartnerConfiguration, surfaceReachFactory: SurfaceReachFactory) {
        this.partnerConfiguration = partnerConfiguration;
        this.surfaceReachFactory = surfaceReachFactory;
    }

    public create(readmeProfiles: readonly RepositoryProfile[], reach: Reach): SurfaceReach[] {
        const profileAddress: string = this.partnerConfiguration.getProfileAddress();

        return [
            ...readmeProfiles.map((repositoryProfile: RepositoryProfile) =>
                this.surfaceReachFactory.create(
                    repositoryProfile,
                    `The readme of ${repositoryProfile.slug}`,
                    this.surfaceOf(repositoryProfile),
                    repositoryProfile.url
                )
            ),
            new SurfaceReach(
                "The GitHub profile",
                `${profileAddress}, with ${reach.getRepositories()} repositories`,
                `https://${profileAddress}`,
                reach.getStars(),
                null,
                null,
                null
            ),
        ];
    }

    private surfaceOf(repositoryProfile: RepositoryProfile): string {
        const onNpm: boolean = repositoryProfile.packages.some(
            (packageListing: PackageListing) => packageListing.getRegistry() === "npm"
        );

        return onNpm ? "On GitHub, and on its page on npm" : "On GitHub";
    }
}
