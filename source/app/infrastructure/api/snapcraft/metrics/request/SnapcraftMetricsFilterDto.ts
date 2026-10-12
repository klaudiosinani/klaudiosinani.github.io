export class SnapcraftMetricsFilterDto {
    private readonly metricName: string;
    private readonly snapId: string;
    private readonly start: string;
    private readonly end: string;

    public constructor(metricName: string, snapId: string, start: string, end: string) {
        this.metricName = metricName;
        this.snapId = snapId;
        this.start = start;
        this.end = end;
    }

    public getMetricName(): string {
        return this.metricName;
    }

    public getSnapId(): string {
        return this.snapId;
    }

    public getStart(): string {
        return this.start;
    }

    public getEnd(): string {
        return this.end;
    }

    public toJSON(): Record<string, string> {
        return {
            metric_name: this.metricName,
            snap_id: this.snapId,
            start: this.start,
            end: this.end,
        };
    }
}
