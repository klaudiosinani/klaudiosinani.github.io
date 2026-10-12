export class MonthGroup<T> {
    private readonly name: string;
    private readonly items: readonly T[];

    public constructor(name: string, items: readonly T[]) {
        this.name = name;
        this.items = items;
    }

    public getName(): string {
        return this.name;
    }

    public getItems(): readonly T[] {
        return this.items;
    }
}
