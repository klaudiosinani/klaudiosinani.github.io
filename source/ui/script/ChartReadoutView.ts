import type { ChartReading } from "./ChartReading";

export class ChartReadoutView {
    private readonly RESTING: string = "Point at the curve, or use the arrow keys";

    private readonly frame: HTMLElement;
    private readonly rule: HTMLElement;
    private readonly dot: HTMLElement;
    private readonly bubble: HTMLElement;

    public constructor(frame: HTMLElement, rule: HTMLElement, dot: HTMLElement, bubble: HTMLElement) {
        this.frame = frame;
        this.rule = rule;
        this.dot = dot;
        this.bubble = bubble;
    }

    public show(reading: ChartReading): void {
        const across: string = `${reading.across * 100}%`;

        this.frame.setAttribute("data-reading", "");
        this.frame.setAttribute("aria-valuenow", String(reading.index));
        this.frame.setAttribute("aria-valuemax", String(reading.last));
        this.frame.setAttribute("aria-valuetext", reading.text);

        this.rule.style.left = across;
        this.dot.style.left = across;
        this.dot.style.bottom = `${reading.height * 100}%`;

        this.bubble.textContent = reading.text;
        this.bubble.style.left = this.placed(reading.across);
    }

    private placed(across: number): string {
        const width: number = this.frame.clientWidth;
        const half: number = this.bubble.offsetWidth / 2;

        if (width < half * 2) {
            return `${width / 2}px`;
        }

        return `${Math.min(Math.max(across * width, half), width - half)}px`;
    }

    public hide(): void {
        this.frame.removeAttribute("data-reading");
        this.frame.setAttribute("aria-valuenow", "0");
        this.frame.setAttribute("aria-valuetext", this.RESTING);
    }
}
