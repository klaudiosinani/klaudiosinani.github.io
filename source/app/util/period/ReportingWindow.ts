export class ReportingWindow {
    private readonly start: Date;
    private readonly end: Date;

    public constructor(start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }

    public getStart(): Date {
        return this.start;
    }
    public getEnd(): Date {
        return this.end;
    }
}
