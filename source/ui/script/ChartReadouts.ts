import type { ChartPoint } from "@app/util/chart/ChartPoint";
import type { ChartReadout } from "./ChartReadout";
import { CHART_READOUT_FACTORY, ChartReadoutFactory } from "./ChartReadoutFactory";

export class ChartReadouts {
    private readonly chartReadoutFactory: ChartReadoutFactory;

    public constructor(chartReadoutFactory: ChartReadoutFactory) {
        this.chartReadoutFactory = chartReadoutFactory;
    }

    private readonly FRAME: string = "[data-readout-frame]";
    private readonly POINTS: string = "[data-readout-points]";

    private listening?: AbortController;

    public mount(): void {
        this.listening?.abort();
        this.listening = undefined;

        const listening: AbortController = new AbortController();

        this.listening = listening;

        document
            .querySelectorAll<HTMLElement>(this.FRAME)
            .forEach((frame: HTMLElement) => this.wire(frame, listening.signal));
    }

    private wire(frame: HTMLElement, signal: AbortSignal): void {
        const held: HTMLElement | null = frame.querySelector<HTMLElement>(this.POINTS);
        const readout: ChartReadout | null = held ? this.chartReadoutFactory.create(frame) : null;

        if (!held || !readout) {
            return;
        }

        readout.hold(this.pointsOf(held));
        readout.listen(signal);
    }

    private pointsOf(held: HTMLElement): ChartPoint[] {
        try {
            return JSON.parse(held.textContent ?? "[]") as ChartPoint[];
        } catch {
            return [];
        }
    }
}

export const CHART_READOUTS: ChartReadouts = new ChartReadouts(CHART_READOUT_FACTORY);
