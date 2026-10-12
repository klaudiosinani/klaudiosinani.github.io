import type { PeriodMetricKey } from "@app/feature/impact/metric/PeriodMetricKey";
import type { ImpactData } from "@app/feature/impact/metric/ImpactData";
import type { ImpactFigure } from "./ImpactFigure";
import type { PeriodFigures } from "./PeriodFigures";
import type { PeriodMetrics } from "@app/feature/impact/metric/PeriodMetrics";
import { WINDOWED_METRICS } from "@ui/feature/impact/component/WindowedMetrics";

import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";
import { ReportingPeriods } from "@app/util/period/ReportingPeriods.ts";

const NUMBER_FORMATTER: NumberFormatter = new NumberFormatter();
const REPORTING_PERIODS: ReportingPeriods = new ReportingPeriods();

export class ImpactFigureFormatter {
    private readonly KEYS: readonly PeriodMetricKey[] = ["downloads", ...WINDOWED_METRICS.KEYS];

    public format(impact: ImpactData): PeriodFigures {
        const figures: PeriodFigures = {} as PeriodFigures;

        for (const period of REPORTING_PERIODS.ALL) {
            const metrics: PeriodMetrics = impact.getPeriods()[period];
            const forPeriod: Record<string, ImpactFigure> = {};

            for (const key of this.KEYS) {
                const value: number | null = metrics.getValue(key);

                if (value !== null) {
                    forPeriod[key] = this.figure(value);
                }
            }

            figures[period] = forPeriod;
        }

        return figures;
    }

    private figure(value: number): ImpactFigure {
        return {
            compact: NUMBER_FORMATTER.display(value),
            exact: NUMBER_FORMATTER.exact(value),
        };
    }
}

export const IMPACT_FIGURE_FORMATTER: ImpactFigureFormatter = new ImpactFigureFormatter();
