import type { PartnerConfiguration } from "./PartnerConfiguration";
import { PLACEMENT_OFFERS } from "./placement/PlacementOffers";
import { PartnerProposal } from "./PartnerProposal";
import type { PlacementsFactory } from "./placement/PlacementsFactory";
import type { Reach } from "@app/feature/reach/Reach";
import type { ReachRetrievalService } from "@app/feature/reach/ReachRetrievalService";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";
import type { RepositoryProfileRetrievalService } from "@app/feature/repository/profile/RepositoryProfileRetrievalService";

export class PartnerRetrievalService {
    private readonly reachRetrievalService: ReachRetrievalService;
    private readonly repositoryProfileRetrievalService: RepositoryProfileRetrievalService;
    private readonly placementsFactory: PlacementsFactory;
    private readonly partnerConfiguration: PartnerConfiguration;

    public constructor(
        reachRetrievalService: ReachRetrievalService,
        repositoryProfileRetrievalService: RepositoryProfileRetrievalService,
        placementsFactory: PlacementsFactory,
        partnerConfiguration: PartnerConfiguration
    ) {
        this.reachRetrievalService = reachRetrievalService;
        this.repositoryProfileRetrievalService = repositoryProfileRetrievalService;
        this.placementsFactory = placementsFactory;
        this.partnerConfiguration = partnerConfiguration;
    }

    public async retrieve(): Promise<PartnerProposal> {
        const [reach, readmeProfiles]: [Reach, RepositoryProfile[]] = await Promise.all([
            this.reachRetrievalService.retrieve(),
            this.readmeProfiles(),
        ]);

        return new PartnerProposal(
            reach,
            readmeProfiles,
            this.placementsFactory.create(readmeProfiles, reach),
            PLACEMENT_OFFERS
        );
    }

    private async readmeProfiles(): Promise<RepositoryProfile[]> {
        const profiles: (RepositoryProfile | null)[] = await Promise.all(
            this.partnerConfiguration
                .getReadmeRepositories()
                .map((repository: string) => this.repositoryProfileRetrievalService.retrieve(repository))
        );

        return profiles.filter((repositoryProfile: RepositoryProfile | null): repositoryProfile is RepositoryProfile =>
            Boolean(repositoryProfile)
        );
    }
}
