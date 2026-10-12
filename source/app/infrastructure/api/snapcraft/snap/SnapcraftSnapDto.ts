export class SnapcraftSnapDto {
    private readonly name: string;
    private readonly snapId: string;

    public constructor(name: string, snapId: string) {
        this.name = name;
        this.snapId = snapId;
    }

    public getName(): string {
        return this.name;
    }

    public getSnapId(): string {
        return this.snapId;
    }
}
