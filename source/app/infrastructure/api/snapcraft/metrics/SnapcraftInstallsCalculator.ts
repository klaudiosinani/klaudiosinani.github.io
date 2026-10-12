import type { SnapcraftMetricsResultDto } from "./response/SnapcraftMetricsResultDto.ts";
import type { SnapcraftMetricsSeriesDto } from "./response/SnapcraftMetricsSeriesDto.ts";

export class SnapcraftInstallsCalculator {
    public calculate(snapcraftMetricsResultDto: SnapcraftMetricsResultDto): number {
        return snapcraftMetricsResultDto
            .getSeries()
            .reduce((total: number, series: SnapcraftMetricsSeriesDto) => total + this.latest(series), 0);
    }

    private latest(series: SnapcraftMetricsSeriesDto): number {
        const values: readonly (number | null)[] = series.getValues();

        for (let index: number = values.length - 1; index >= 0; index--) {
            const value: number | null = values[index];

            if (value !== null) {
                return value;
            }
        }

        return 0;
    }
}
