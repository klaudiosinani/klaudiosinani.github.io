import type { RepositoryFigure } from "./RepositoryFigure";

export class RepositoryFigureCluster {
    private readonly name: string;
    private readonly figures: RepositoryFigure[];

    public constructor(name: string, figures: RepositoryFigure[]) {
        this.name = name;
        this.figures = figures;
    }

    public getName(): string {
        return this.name;
    }
    public getFigures(): RepositoryFigure[] {
        return this.figures;
    }
}
