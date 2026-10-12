import type { RepositoryFigure } from "./RepositoryFigure";

export class DraftedCluster {
    private readonly name: string;
    private readonly figures: readonly (RepositoryFigure | false | null)[];

    public constructor(name: string, figures: readonly (RepositoryFigure | false | null)[]) {
        this.name = name;
        this.figures = figures;
    }

    public getName(): string {
        return this.name;
    }

    public readFigures(): RepositoryFigure[] {
        return this.figures.filter(Boolean) as RepositoryFigure[];
    }
}
