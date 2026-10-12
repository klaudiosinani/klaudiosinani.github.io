export class PlacementOffer {
    private readonly name: string;
    private readonly note: string;

    public constructor(name: string, note: string) {
        this.name = name;
        this.note = note;
    }

    public getName(): string {
        return this.name;
    }

    public getNote(): string {
        return this.note;
    }
}
