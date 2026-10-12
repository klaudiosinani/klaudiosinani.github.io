import type { MonthVolume } from "./MonthVolume";

export class FieldData {
    private readonly monthVolumes: readonly MonthVolume[];
    private readonly dependentRepositories: number;

    public constructor(monthVolumes: readonly MonthVolume[], dependentRepositories: number) {
        this.monthVolumes = monthVolumes;
        this.dependentRepositories = dependentRepositories;
    }

    public getMonthVolumes(): readonly MonthVolume[] {
        return this.monthVolumes;
    }

    public getDependentRepositories(): number {
        return this.dependentRepositories;
    }
}
