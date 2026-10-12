import { BuildAnswer } from "@app/infrastructure/common/BuildAnswer";
import type { ActivityData } from "./data/ActivityData";
import type { ActivityDataProvider } from "./data/ActivityDataProvider";

export class ActivityDataRetrievalService {
    private readonly provider: ActivityDataProvider;
    private readonly username: string;
    private readonly answer: BuildAnswer<ActivityData> = new BuildAnswer();

    public constructor(username: string, provider: ActivityDataProvider) {
        this.username = username;
        this.provider = provider;
    }

    public async retrieve(): Promise<ActivityData> {
        return this.answer.of(() => this.provider.provide(this.username));
    }
}
