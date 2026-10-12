import type { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import type { InstanceResolver } from "@app/injection/InstanceResolver.ts";
import { ACTIVITY_DATASET_RETRIEVAL_SERVICE } from "@app/injection/ApplicationKeys.ts";
import { DependentTotalCalculator } from "@app/feature/reach/DependentTotalCalculator.ts";
import { FieldDataFactory } from "@app/feature/field/FieldDataFactory.ts";
import { FieldDataRetrievalService } from "@app/feature/field/FieldDataRetrievalService.ts";
import { MonthSeriesLabeler } from "@app/util/datetime/MonthSeriesLabeler.ts";
import { ProfileCollectionService } from "@app/feature/repository/profile/ProfileCollectionService.ts";
import { ReachConfiguration } from "@app/feature/reach/ReachConfiguration.ts";

export const bindField = (registry: InstanceFactoryRegistry, resolver: InstanceResolver): void => {
    registry.bind(MonthSeriesLabeler, () => new MonthSeriesLabeler());
    registry.bind(FieldDataFactory, () => new FieldDataFactory(resolver.resolve(MonthSeriesLabeler)));
    registry.bind(
        FieldDataRetrievalService,
        () =>
            new FieldDataRetrievalService(
                resolver.resolve(ACTIVITY_DATASET_RETRIEVAL_SERVICE),
                resolver.resolve(ProfileCollectionService),
                resolver.resolve(DependentTotalCalculator),
                resolver.resolve(FieldDataFactory),
                resolver.resolve(ReachConfiguration)
            )
    );
};
