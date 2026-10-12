import { SnapcraftMetricsFilterDto } from "./SnapcraftMetricsFilterDto.ts";
import { SnapcraftMetricsRequestDto } from "./SnapcraftMetricsRequestDto.ts";

export class SnapcraftMetricsRequestDtoFactory {
    private readonly METRIC: string = "weekly_installed_base_by_channel";
    private readonly DAY_IN_MILLISECONDS: number = 24 * 60 * 60 * 1000;
    private readonly WINDOW_IN_DAYS: number = 30;
    private readonly DAY_LENGTH: number = 10;

    public create(snapIds: string[], today: Date): SnapcraftMetricsRequestDto {
        const start: Date = new Date(today.getTime() - this.WINDOW_IN_DAYS * this.DAY_IN_MILLISECONDS);

        const filters: SnapcraftMetricsFilterDto[] = snapIds.map(
            (snapId: string) =>
                new SnapcraftMetricsFilterDto(this.METRIC, snapId, this.formatDate(start), this.formatDate(today))
        );

        return new SnapcraftMetricsRequestDto(filters);
    }

    private formatDate(date: Date): string {
        const isoDate: string = date.toISOString();

        return isoDate.slice(0, this.DAY_LENGTH);
    }
}
