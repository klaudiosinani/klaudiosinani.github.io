import type { TickerPace } from "./TickerPace";

export class FieldTicker {
    private readonly TRAVEL: string = "0.3em";
    private readonly EASING: string = "cubic-bezier(0.2, 0, 0, 1)";

    private readonly tickerElement: HTMLElement;
    private readonly tickerPace: TickerPace;
    private shownTicker: string = "";
    private shownLine: HTMLSpanElement | null = null;
    private leavingLine: HTMLSpanElement | null = null;
    private changedAt: number | null = null;

    public constructor(tickerElement: HTMLElement, tickerPace: TickerPace) {
        this.tickerElement = tickerElement;
        this.tickerPace = tickerPace;
    }

    public show(ticker: string, moving: boolean): void {
        if (ticker === this.shownTicker && this.shownLine !== null) {
            return;
        }

        const now: number = performance.now();
        const duration: number = this.tickerPace.durationAfter(this.changedAt === null ? null : now - this.changedAt);
        const enteringLine: HTMLSpanElement = document.createElement("span");

        enteringLine.textContent = ticker;
        this.shownTicker = ticker;
        this.changedAt = now;
        this.leavingLine?.remove();
        this.leavingLine = null;

        if (!moving || this.shownLine === null) {
            this.tickerElement.replaceChildren(enteringLine);
            this.shownLine = enteringLine;

            return;
        }

        this.leave(this.shownLine, duration);
        this.tickerElement.append(enteringLine);
        enteringLine.animate(
            [
                { opacity: 0, transform: `translateY(${this.TRAVEL})` },
                { opacity: 1, transform: "none" },
            ],
            { duration, easing: this.EASING }
        );
        this.shownLine = enteringLine;
    }

    private leave(line: HTMLSpanElement, duration: number): void {
        const cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(line);
        const keyframes: Keyframe[] = [
            { opacity: cssStyleDeclaration.opacity, transform: cssStyleDeclaration.transform },
            { opacity: 0, transform: `translateY(-${this.TRAVEL})` },
        ];

        line.getAnimations().forEach((animation: Animation) => animation.cancel());

        const animation: Animation = line.animate(keyframes, { duration, easing: this.EASING, fill: "forwards" });

        animation.onfinish = (): void => line.remove();
        this.leavingLine = line;
    }
}
