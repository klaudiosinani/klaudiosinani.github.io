export class RepositoryOgFigure {
    private readonly value: string;
    private readonly label: string;

    public constructor(value: string, label: string) {
        this.value = value;
        this.label = label;
    }

    public getValue(): string {
        return this.value;
    }
    public getLabel(): string {
        return this.label;
    }
}
