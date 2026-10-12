export class PypiRecentDownloadsDto {
    private readonly lastMonth: number;

    public constructor(lastMonth: number) {
        this.lastMonth = lastMonth;
    }

    public getLastMonth(): number {
        return this.lastMonth;
    }
}
