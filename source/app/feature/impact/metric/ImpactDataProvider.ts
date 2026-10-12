import type { ImpactData } from "./ImpactData";

export interface ImpactDataProvider {
    provide(username: string): Promise<ImpactData>;
}
