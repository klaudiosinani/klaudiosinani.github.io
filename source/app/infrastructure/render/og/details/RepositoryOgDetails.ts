import type { RepositoryOgFigure } from "./RepositoryOgFigure";
export class RepositoryOgDetails {
    private readonly name: string;
    private readonly logline: string;
    private readonly version: string | null;
    private readonly address: string;
    private readonly figures: RepositoryOgFigure[];

    public constructor(
        name: string,
        logline: string,
        version: string | null,
        address: string,
        figures: RepositoryOgFigure[]
    ) {
        this.name = name;
        this.logline = logline;
        this.version = version;
        this.address = address;
        this.figures = figures;
    }

    public getName(): string {
        return this.name;
    }
    public getLogline(): string {
        return this.logline;
    }
    public getVersion(): string | null {
        return this.version;
    }
    public getAddress(): string {
        return this.address;
    }
    public getFigures(): RepositoryOgFigure[] {
        return this.figures;
    }
}
