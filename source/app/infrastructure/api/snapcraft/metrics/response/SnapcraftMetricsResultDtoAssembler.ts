import { SnapcraftMetricsResultDto } from "./SnapcraftMetricsResultDto.ts";
import type { SnapcraftMetricsSeriesDto } from "./SnapcraftMetricsSeriesDto.ts";
import type { SnapcraftMetricsSeriesDtoAssembler } from "./SnapcraftMetricsSeriesDtoAssembler.ts";

export class SnapcraftMetricsResultDtoAssembler {
    private readonly snapcraftMetricsSeriesDtoAssembler: SnapcraftMetricsSeriesDtoAssembler;

    public constructor(snapcraftMetricsSeriesDtoAssembler: SnapcraftMetricsSeriesDtoAssembler) {
        this.snapcraftMetricsSeriesDtoAssembler = snapcraftMetricsSeriesDtoAssembler;
    }

    public assemble(payload: unknown): SnapcraftMetricsResultDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const series: unknown = record.series;
        const entries: unknown[] = Array.isArray(series) ? series : [];

        const snapcraftMetricsSeriesDtos: SnapcraftMetricsSeriesDto[] = entries.map((entry: unknown) =>
            this.snapcraftMetricsSeriesDtoAssembler.assemble(entry)
        );

        return new SnapcraftMetricsResultDto(
            typeof record.snap_id === "string" ? record.snap_id : "",
            snapcraftMetricsSeriesDtos
        );
    }
}
