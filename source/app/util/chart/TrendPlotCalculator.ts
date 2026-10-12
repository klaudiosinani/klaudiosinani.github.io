import type { MonotoneCurveCalculator } from "@app/util/chart/MonotoneCurveCalculator";
import { TrendPlot } from "@app/util/chart/TrendPlot";
import { TrendPoint } from "@app/util/chart/TrendPoint";

export class TrendPlotCalculator {
    private readonly monotoneCurveCalculator: MonotoneCurveCalculator;
    private readonly MAX_POINTS: number = 120;

    public constructor(monotoneCurveCalculator: MonotoneCurveCalculator) {
        this.monotoneCurveCalculator = monotoneCurveCalculator;
    }

    public compute(trend: number[], width: number, height: number, cycle: number): TrendPlot {
        const points: number[] = this.reduce(this.smooth(trend, cycle), cycle);

        if (points.length < 2) {
            return new TrendPlot("", "", null);
        }

        const low: number = Math.min(...points);
        const high: number = Math.max(...points);
        const span: number = high - low;
        const step: number = width / (points.length - 1);

        const plotted: TrendPoint[] = points.map((value: number, index: number) => {
            const scaled: number = span === 0 ? 0.5 : (value - low) / span;

            return new TrendPoint(index * step, height - 4 - scaled * (height - 8));
        });

        const line: string = this.monotoneCurveCalculator.compute(plotted);
        const end: TrendPoint = plotted[plotted.length - 1];

        return new TrendPlot(
            line,
            `${line} L ${width.toFixed(2)} ${height.toFixed(2)} L 0 ${height.toFixed(2)} Z`,
            end
        );
    }

    private smooth(trend: number[], cycle: number): number[] {
        if (cycle < 2 || trend.length <= cycle) {
            return trend;
        }

        return trend.slice(cycle - 1).map((_: number, offset: number) => {
            const window: number[] = trend.slice(offset, offset + cycle);

            return window.reduce((sum: number, value: number) => sum + value, 0) / cycle;
        });
    }

    private reduce(trend: number[], cycle: number): number[] {
        if (trend.length <= this.MAX_POINTS) {
            return trend;
        }

        const wanted: number = Math.ceil(trend.length / this.MAX_POINTS);
        const size: number = Math.max(cycle, Math.ceil(wanted / cycle) * cycle);
        const buckets: number[] = [];

        for (let start: number = 0; start < trend.length; start += size) {
            const slice: number[] = trend.slice(start, start + size);

            buckets.push(slice.reduce((sum: number, value: number) => sum + value, 0) / slice.length);
        }

        return buckets;
    }
}
