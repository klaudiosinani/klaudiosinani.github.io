export class MonthVolume {
    private readonly label: string;
    private readonly downloads: number;

    public constructor(label: string, downloads: number) {
        this.label = label;
        this.downloads = downloads;
    }

    public getLabel(): string {
        return this.label;
    }

    public getDownloads(): number {
        return this.downloads;
    }
}
