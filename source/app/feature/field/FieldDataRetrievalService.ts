import type { ActivityDatasetRetrievalService } from "@app/feature/impact/ActivityDatasetRetrievalService";
import type { DependentTotalCalculator } from "@app/feature/reach/DependentTotalCalculator";
import type { FieldData } from "./FieldData";
import type { FieldDataFactory } from "./FieldDataFactory";
import type { ImpactData } from "@app/feature/impact/metric/ImpactData";
import type { ProfileCollectionService } from "@app/feature/repository/profile/ProfileCollectionService";
import type { ReachConfiguration } from "@app/feature/reach/ReachConfiguration";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";

export class FieldDataRetrievalService {
    private readonly activityDatasetRetrievalService: ActivityDatasetRetrievalService;
    private readonly profileCollectionService: ProfileCollectionService;
    private readonly dependentTotalCalculator: DependentTotalCalculator;
    private readonly fieldDataFactory: FieldDataFactory;
    private readonly reachConfiguration: ReachConfiguration;

    public constructor(
        activityDatasetRetrievalService: ActivityDatasetRetrievalService,
        profileCollectionService: ProfileCollectionService,
        dependentTotalCalculator: DependentTotalCalculator,
        fieldDataFactory: FieldDataFactory,
        reachConfiguration: ReachConfiguration
    ) {
        this.activityDatasetRetrievalService = activityDatasetRetrievalService;
        this.profileCollectionService = profileCollectionService;
        this.dependentTotalCalculator = dependentTotalCalculator;
        this.fieldDataFactory = fieldDataFactory;
        this.reachConfiguration = reachConfiguration;
    }

    public async retrieve(): Promise<FieldData> {
        const [impactData, repositoryProfiles]: [ImpactData, RepositoryProfile[]] = await Promise.all([
            this.activityDatasetRetrievalService.retrieve(),
            this.profileCollectionService.retrieve(),
        ]);

        return this.fieldDataFactory.create(
            impactData,
            this.dependentTotalCalculator.total(repositoryProfiles) ?? 0,
            this.reachConfiguration.getRecordStartYear()
        );
    }
}
