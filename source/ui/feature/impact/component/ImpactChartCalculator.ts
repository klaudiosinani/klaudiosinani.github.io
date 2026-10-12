import { MonotoneCurveCalculator } from "@app/util/chart/MonotoneCurveCalculator.ts";
import type { ImpactChart } from "./ImpactChart";
import { IMPACT_CHART_CONFIGURATION } from "@ui/feature/impact/component/ImpactChartConfiguration";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";
import type { TrendPlot } from "@app/util/chart/TrendPlot";

import { ReportingPeriods } from "@app/util/period/ReportingPeriods.ts";
import { TrendMarkerCalculator } from "@app/util/chart/TrendMarkerCalculator.ts";
import { TrendPlotCalculator } from "@app/util/chart/TrendPlotCalculator.ts";

const REPORTING_PERIODS: ReportingPeriods = new ReportingPeriods();
const TREND_MARKER_CALCULATOR: TrendMarkerCalculator = new TrendMarkerCalculator();
const TREND_PLOT_CALCULATOR: TrendPlotCalculator = new TrendPlotCalculator(new MonotoneCurveCalculator());
export class ImpactChartCalculator {
    public compute(trend: Record<ReportingPeriod, number[]>): Record<ReportingPeriod, ImpactChart> {
        const charts: Record<"month" | "quarter" | "year" | "all", ImpactChart> = {} as Record<
            ReportingPeriod,
            ImpactChart
        >;

        for (const period of REPORTING_PERIODS.ALL) {
            const plot: TrendPlot = TREND_PLOT_CALCULATOR.compute(
                trend[period],
                IMPACT_CHART_CONFIGURATION.WIDTH,
                IMPACT_CHART_CONFIGURATION.HEIGHT,
                IMPACT_CHART_CONFIGURATION.cycle(period)
            );

            charts[period] = {
                line: plot.getLine(),
                area: plot.getArea(),
                marker: TREND_MARKER_CALCULATOR.compute(
                    plot.getEnd(),
                    IMPACT_CHART_CONFIGURATION.WIDTH,
                    IMPACT_CHART_CONFIGURATION.HEIGHT
                ),
            };
        }

        return charts;
    }
}

export const IMPACT_CHART_CALCULATOR: ImpactChartCalculator = new ImpactChartCalculator();
