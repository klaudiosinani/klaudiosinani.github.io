import { ChartCurve } from "./ChartCurve";
import type { ChartPoint } from "@app/util/chart/ChartPoint";
import type { ChartReading } from "./ChartReading";
import { ChartReadings } from "@app/util/chart/ChartReadings";
import { ChartReadoutView } from "./ChartReadoutView";

import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";

const NUMBER_FORMATTER: NumberFormatter = new NumberFormatter();
export class ChartReadout {
    private readonly frame: HTMLElement;
    private readonly curve: ChartCurve;
    private readonly view: ChartReadoutView;

    private points: ChartPoint[] = [];
    private readings: ChartReadings = new ChartReadings(0);
    private at: number = -1;

    public constructor(frame: HTMLElement, curve: ChartCurve, view: ChartReadoutView) {
        this.frame = frame;
        this.curve = curve;
        this.view = view;
    }

    public hold(points: ChartPoint[]): void {
        this.points = points;
        this.readings = new ChartReadings(points.length);
        this.hide();
    }

    public listen(signal: AbortSignal): void {
        this.frame.addEventListener("pointermove", (event: PointerEvent) => this.follow(event), { signal });
        this.frame.addEventListener("pointerleave", () => this.hide(), { signal });
        this.frame.addEventListener("keydown", (event: KeyboardEvent) => this.walk(event), { signal });
        this.frame.addEventListener("blur", () => this.hide(), { signal });
    }

    private follow(event: PointerEvent): void {
        const box: DOMRect = this.frame.getBoundingClientRect();

        if (box.width === 0 || this.readings.empty) {
            return;
        }

        this.show(this.readings.at((event.clientX - box.left) / box.width));
    }

    private walk(event: KeyboardEvent): void {
        const step: number = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

        if (step === 0) {
            return;
        }

        event.preventDefault();
        this.show(this.at < 0 ? 0 : this.at + step);
    }

    private show(index: number): void {
        if (this.readings.empty) {
            return;
        }

        this.at = this.readings.clamp(index);
        this.view.show(this.reading(this.at));
    }

    private hide(): void {
        this.at = -1;
        this.view.hide();
    }

    private reading(index: number): ChartReading {
        const point: ChartPoint = this.points[index];
        const across: number = this.readings.across(index);

        return {
            index,
            last: this.readings.last,
            across,
            height: this.curve.heightAt(across),
            text: point.at
                ? `${point.at}, ${NUMBER_FORMATTER.display(point.value)}`
                : NUMBER_FORMATTER.display(point.value),
        };
    }
}
