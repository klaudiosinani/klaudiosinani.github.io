import type { ActivityDatasetRetrievalService } from "@app/feature/impact/ActivityDatasetRetrievalService";
import type { ImpactData } from "@app/feature/impact/metric/ImpactData";
import type { Reach } from "./Reach";
import type { ReachFactory } from "./ReachFactory";
import type { DependentTotalCalculator } from "./DependentTotalCalculator";
import type { ProfileCollectionService } from "@app/feature/repository/profile/ProfileCollectionService";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";

export class ReachRetrievalService {
    private readonly activityDatasetRetrievalService: ActivityDatasetRetrievalService;
    private readonly profileCollectionService: ProfileCollectionService;
    private readonly dependentTotalCalculator: DependentTotalCalculator;
    private readonly reachFactory: ReachFactory;

    public constructor(
        activityDatasetRetrievalService: ActivityDatasetRetrievalService,
        profileCollectionService: ProfileCollectionService,
        dependentTotalCalculator: DependentTotalCalculator,
        reachFactory: ReachFactory
    ) {
        this.activityDatasetRetrievalService = activityDatasetRetrievalService;
        this.profileCollectionService = profileCollectionService;
        this.dependentTotalCalculator = dependentTotalCalculator;
        this.reachFactory = reachFactory;
    }

    public async retrieve(): Promise<Reach> {
        const [impactData, repositoryProfiles]: [ImpactData, RepositoryProfile[]] = await Promise.all([
            this.activityDatasetRetrievalService.retrieve(),
            this.profileCollectionService.retrieve(),
        ]);

        return this.reachFactory.create(impactData, this.dependentTotalCalculator.total(repositoryProfiles));
    }
}
