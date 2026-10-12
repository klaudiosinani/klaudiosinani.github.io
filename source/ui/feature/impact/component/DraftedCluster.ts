import type { StandingFigure } from "./StandingFigure";

export interface DraftedCluster {
    readonly name: string;
    readonly figures: readonly (StandingFigure | null)[];
}
