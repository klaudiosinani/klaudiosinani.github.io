import type { PlacementOffer } from "./placement/PlacementOffer";
import type { Reach } from "@app/feature/reach/Reach";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";
import type { SurfaceReach } from "@app/feature/reach/surface/SurfaceReach";

export class PartnerProposal {
    private readonly reach: Reach;
    private readonly readmeProfiles: readonly RepositoryProfile[];
    private readonly placements: readonly SurfaceReach[];
    private readonly offers: readonly PlacementOffer[];

    public constructor(
        reach: Reach,
        readmeProfiles: readonly RepositoryProfile[],
        placements: readonly SurfaceReach[],
        offers: readonly PlacementOffer[]
    ) {
        this.reach = reach;
        this.readmeProfiles = readmeProfiles;
        this.placements = placements;
        this.offers = offers;
    }

    public getReach(): Reach {
        return this.reach;
    }

    public getReadmeProfiles(): readonly RepositoryProfile[] {
        return this.readmeProfiles;
    }

    public getPlacements(): readonly SurfaceReach[] {
        return this.placements;
    }

    public getOffers(): readonly PlacementOffer[] {
        return this.offers;
    }

    public getLeadProfile(): RepositoryProfile | null {
        return this.readmeProfiles[0] ?? null;
    }
}
