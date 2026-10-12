import { SnapcraftMetricsSeriesDto } from "./SnapcraftMetricsSeriesDto.ts";

export class SnapcraftMetricsSeriesDtoAssembler {
    public assemble(payload: unknown): SnapcraftMetricsSeriesDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const values: unknown = record.values;
        const entries: unknown[] = Array.isArray(values) ? values : [];

        return new SnapcraftMetricsSeriesDto(
            typeof record.name === "string" ? record.name : "",
            entries.map((entry: unknown) => (typeof entry === "number" ? entry : null))
        );
    }
}
