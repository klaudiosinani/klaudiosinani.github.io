export class SnapcraftMetricsSeriesDto {
    private readonly name: string;
    private readonly values: readonly (number | null)[];

    public constructor(name: string, values: readonly (number | null)[]) {
        this.name = name;
        this.values = values;
    }

    public getName(): string {
        return this.name;
    }

    public getValues(): readonly (number | null)[] {
        return this.values;
    }
}
