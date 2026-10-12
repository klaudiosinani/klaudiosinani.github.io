export class CountedDownloadSource {
    private readonly label: string;
    private readonly value: number;
    private readonly note: string | undefined;

    public constructor(label: string, value: number, note: string | undefined) {
        this.label = label;
        this.value = value;
        this.note = note;
    }

    public getLabel(): string {
        return this.label;
    }

    public getValue(): number {
        return this.value;
    }

    public getNote(): string | undefined {
        return this.note;
    }
}
