import type { ImpactData } from "@app/feature/impact/metric/ImpactData.ts";
import type { ImpactDataProvider } from "@app/feature/impact/metric/ImpactDataProvider.ts";
import { BuildAnswer } from "@app/infrastructure/common/BuildAnswer";

export class ActivityDatasetRetrievalService {
    private readonly username: string;
    private readonly impactDataProvider: ImpactDataProvider;
    private readonly buildAnswer: BuildAnswer<ImpactData> = new BuildAnswer();

    public constructor(username: string, impactDataProvider: ImpactDataProvider) {
        this.username = username;
        this.impactDataProvider = impactDataProvider;
    }

    public async retrieve(): Promise<ImpactData> {
        return this.buildAnswer.of(() => this.impactDataProvider.provide(this.username));
    }
}
