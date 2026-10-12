import type { ActivityData } from "./ActivityData";

export interface ActivityDataProvider {
    provide(username: string): Promise<ActivityData>;
}
