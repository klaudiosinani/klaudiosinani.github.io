import type { SnapcraftMetricsSeriesDto } from "./SnapcraftMetricsSeriesDto.ts";

export class SnapcraftMetricsResultDto {
    private readonly snapId: string;
    private readonly series: readonly SnapcraftMetricsSeriesDto[];

    public constructor(snapId: string, series: readonly SnapcraftMetricsSeriesDto[]) {
        this.snapId = snapId;
        this.series = series;
    }

    public getSnapId(): string {
        return this.snapId;
    }

    public getSeries(): readonly SnapcraftMetricsSeriesDto[] {
        return this.series;
    }
}
