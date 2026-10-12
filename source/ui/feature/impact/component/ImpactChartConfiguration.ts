import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class ImpactChartConfiguration {
    public readonly WIDTH: number = 960;

    public readonly HEIGHT: number = 180;

    public readonly VIEW_BOX: string = `0 0 ${this.WIDTH} ${this.HEIGHT}`;

    private readonly CYCLES: Record<ReportingPeriod, number> = {
        month: 7,
        quarter: 7,
        year: 7,
        all: 1,
    };

    public cycle(period: ReportingPeriod): number {
        return this.CYCLES[period];
    }
}

export const IMPACT_CHART_CONFIGURATION: ImpactChartConfiguration = new ImpactChartConfiguration();
