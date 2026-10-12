export class PypiDownloadWindow {
    private readonly downloads: number;
    private readonly days: number;

    public constructor(downloads: number, days: number) {
        this.downloads = downloads;
        this.days = days;
    }

    public getDownloads(): number {
        return this.downloads;
    }

    public getDays(): number {
        return this.days;
    }
}
