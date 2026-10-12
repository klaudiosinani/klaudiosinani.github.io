export class DownloadSource {
    private readonly label: string;
    private readonly value: number | null;
    private readonly note: string | undefined;

    public constructor(label: string, value: number | null, note: string | undefined) {
        this.label = label;
        this.value = value;
        this.note = note;
    }

    public getLabel(): string {
        return this.label;
    }

    public getValue(): number | null {
        return this.value;
    }

    public getNote(): string | undefined {
        return this.note;
    }

    public isCounted(): boolean {
        return this.value !== null && this.value > 0;
    }
}
