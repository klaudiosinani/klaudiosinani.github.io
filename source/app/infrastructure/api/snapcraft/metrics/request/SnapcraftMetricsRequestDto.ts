import type { SnapcraftMetricsFilterDto } from "./SnapcraftMetricsFilterDto.ts";

export class SnapcraftMetricsRequestDto {
    private readonly filters: readonly SnapcraftMetricsFilterDto[];

    public constructor(filters: readonly SnapcraftMetricsFilterDto[]) {
        this.filters = filters;
    }

    public getFilters(): readonly SnapcraftMetricsFilterDto[] {
        return this.filters;
    }

    public toJSON(): Record<string, unknown> {
        return { filters: this.filters };
    }
}
