import type { ImpactData } from "@app/feature/impact/metric/ImpactData";
import type { MonthSeriesLabeler } from "@app/util/datetime/MonthSeriesLabeler";
import { FieldData } from "./FieldData";
import { MonthVolume } from "./MonthVolume";

export class FieldDataFactory {
    private readonly SMALLEST_MONTH: number = 100_000;

    private readonly monthSeriesLabeler: MonthSeriesLabeler;

    public constructor(monthSeriesLabeler: MonthSeriesLabeler) {
        this.monthSeriesLabeler = monthSeriesLabeler;
    }

    public create(impactData: ImpactData, dependentRepositories: number, startYear: number): FieldData {
        const downloads: number[] = impactData.getDownloadTrend().all;
        const labels: string[] = this.monthSeriesLabeler.label(startYear, downloads.length);

        const first: number = downloads.findIndex((count: number) => count >= this.SMALLEST_MONTH);

        return new FieldData(
            downloads
                .map((count: number, index: number) => new MonthVolume(labels[index], count))
                .slice(first === -1 ? downloads.length : first),
            dependentRepositories
        );
    }
}
