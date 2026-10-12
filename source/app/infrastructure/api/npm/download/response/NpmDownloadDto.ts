export class NpmDownloadDto {
    private readonly day: string;
    private readonly downloads: number;

    public constructor(day: string, downloads: number) {
        this.day = day;
        this.downloads = downloads;
    }

    public getDay(): string {
        return this.day;
    }

    public getDownloads(): number {
        return this.downloads;
    }
}
