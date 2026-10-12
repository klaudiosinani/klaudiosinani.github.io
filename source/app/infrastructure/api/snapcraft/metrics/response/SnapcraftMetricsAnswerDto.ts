import type { SnapcraftMetricsResultDto } from "./SnapcraftMetricsResultDto.ts";

export class SnapcraftMetricsAnswerDto {
    private readonly metrics: readonly SnapcraftMetricsResultDto[];

    public constructor(metrics: readonly SnapcraftMetricsResultDto[]) {
        this.metrics = metrics;
    }

    public getMetrics(): readonly SnapcraftMetricsResultDto[] {
        return this.metrics;
    }
}
