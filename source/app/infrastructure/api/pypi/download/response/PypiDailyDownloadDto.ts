export class PypiDailyDownloadDto {
    private readonly date: string;
    private readonly downloads: number;

    public constructor(date: string, downloads: number) {
        this.date = date;
        this.downloads = downloads;
    }

    public getDate(): string {
        return this.date;
    }

    public getDownloads(): number {
        return this.downloads;
    }
}
