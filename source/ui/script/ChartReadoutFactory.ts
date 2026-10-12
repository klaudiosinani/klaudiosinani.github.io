import { ChartCurve } from "./ChartCurve";
import { ChartReadout } from "./ChartReadout";
import { ChartReadoutView } from "./ChartReadoutView";

export class ChartReadoutFactory {
    public create(frame: HTMLElement): ChartReadout | null {
        const line: SVGPathElement | null = frame.querySelector<SVGPathElement>("[data-chart]");
        const rule: HTMLElement | null = frame.querySelector<HTMLElement>("[data-readout-rule]");
        const dot: HTMLElement | null = frame.querySelector<HTMLElement>("[data-readout-dot]");
        const bubble: HTMLElement | null = frame.querySelector<HTMLElement>("[data-readout-bubble]");

        if (!line || !rule || !dot || !bubble) {
            return null;
        }

        return new ChartReadout(frame, new ChartCurve(line), new ChartReadoutView(frame, rule, dot, bubble));
    }
}

export const CHART_READOUT_FACTORY: ChartReadoutFactory = new ChartReadoutFactory();
