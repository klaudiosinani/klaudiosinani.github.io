import type { ChartPoint } from "@app/util/chart/ChartPoint";
import type { ChartReadout } from "./ChartReadout";
import { CHART_READOUT_FACTORY, ChartReadoutFactory } from "./ChartReadoutFactory";

export class ImpactChartReadout {
    private readonly chartReadoutFactory: ChartReadoutFactory;

    public constructor(chartReadoutFactory: ChartReadoutFactory) {
        this.chartReadoutFactory = chartReadoutFactory;
    }

    private readonly FRAME: string = "[data-impact-plot]";
    private readonly PAYLOAD: string = "#impact-data";
    private readonly DEFAULT_PERIOD: string = "year";

    private listening?: AbortController;

    public mount(): void {
        this.listening?.abort();
        this.listening = undefined;

        const frame: HTMLElement | null = document.querySelector<HTMLElement>(this.FRAME);
        const payload: HTMLElement | null = document.querySelector<HTMLElement>(this.PAYLOAD);

        if (!frame || !payload) {
            return;
        }

        const readout: ChartReadout | null = this.chartReadoutFactory.create(frame);

        if (!readout) {
            return;
        }

        const listening: AbortController = new AbortController();
        const { signal } = listening;
        const read = (): void => readout.hold(this.pointsOf(payload, frame));

        this.listening = listening;

        read();
        document.addEventListener("impact:period", read, { signal });
        readout.listen(signal);
    }

    private pointsOf(payload: HTMLElement, frame: HTMLElement): ChartPoint[] {
        try {
            const held: Record<string, ChartPoint[]> = JSON.parse(payload.textContent ?? "{}").points;

            return held?.[frame.dataset.period ?? this.DEFAULT_PERIOD] ?? [];
        } catch {
            return [];
        }
    }
}

export const IMPACT_CHART_READOUT: ImpactChartReadout = new ImpactChartReadout(CHART_READOUT_FACTORY);
