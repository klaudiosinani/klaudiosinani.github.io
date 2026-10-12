export class NpmDownloadDateRange {
    private readonly from: Date;
    private readonly to: Date;

    public constructor(from: Date, to: Date) {
        this.from = from;
        this.to = to;
    }

    public getFrom(): Date {
        return this.from;
    }

    public getTo(): Date {
        return this.to;
    }
}
