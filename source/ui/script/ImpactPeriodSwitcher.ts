interface Figure {
    compact: string;
    exact: string;
}

interface Plot {
    line: string;
    area: string;
    marker: string | null;
}

interface Delta {
    text: string;
    direction: "up" | "down";
    label: string;
}

interface Baked {
    figures: Record<string, Record<string, Figure>>;
    charts: Record<string, Plot>;
    deltas: Record<string, Record<string, Delta | null>>;
    ranges: Record<string, string>;
}

export class ImpactPeriodSwitcher {
    private readonly DATA: string = "[data-impact-figures]";
    private readonly RANGE: string = "[data-impact-range]";
    private readonly PERIOD_ONLY: string = "[data-period-only]";
    private readonly BUTTON: string = ".impact-period";
    private readonly VALUE: string = "[data-metric]";
    private readonly CHART: string = "[data-chart]";
    private readonly AREA: string = "[data-area]";
    private readonly POINT: string = "[data-point]";
    private readonly DELTA: string = "[data-delta]";
    private readonly HIDDEN: string = "display-none";

    public mount(): void {
        const baked: Baked | null = this.baked();

        if (!baked) {
            return;
        }

        document.querySelectorAll<HTMLButtonElement>(this.BUTTON).forEach((button: HTMLButtonElement) => {
            button.addEventListener("click", () => this.select(button, baked));
        });
    }

    private select(button: HTMLButtonElement, baked: Baked): void {
        const period: string | undefined = button.dataset.period;

        if (!period || !baked.figures[period]) {
            return;
        }

        this.press(button);
        this.figures(baked.figures[period]);
        this.range(baked.ranges?.[period] ?? "");
        this.blocks(period);
        this.chart(period, baked.charts[period]);
        this.deltas(baked.deltas?.[period] ?? {});
    }

    private press(button: HTMLButtonElement): void {
        document.querySelectorAll<HTMLButtonElement>(this.BUTTON).forEach((other: HTMLButtonElement) => {
            other.setAttribute("aria-pressed", other === button ? "true" : "false");
        });
    }

    private figures(figures: Record<string, Figure>): void {
        document.querySelectorAll<HTMLElement>(this.VALUE).forEach((element: HTMLElement) => {
            const metric: string | undefined = element.dataset.metric;
            const figure: Figure | undefined = metric ? figures[metric] : undefined;

            if (!figure) {
                return;
            }

            element.textContent = figure.compact;
            element.setAttribute("aria-label", `${figure.exact} ${element.dataset.label ?? ""}`.trim());
        });
    }

    private range(dates: string): void {
        const range: HTMLElement | null = document.querySelector<HTMLElement>(this.RANGE);

        if (range) {
            range.textContent = dates;
        }
    }

    private blocks(period: string): void {
        document.querySelectorAll<HTMLElement>(this.PERIOD_ONLY).forEach((block: HTMLElement) => {
            block.hidden = block.dataset.periodOnly !== period;
        });
    }

    private chart(period: string, plot: Plot | undefined): void {
        const frame: HTMLElement | null = document.querySelector<HTMLElement>("[data-impact-plot]");

        if (frame) {
            frame.dataset.period = period;
            frame.removeAttribute("data-reading");
            document.dispatchEvent(new CustomEvent("impact:period"));
        }

        document.querySelector<SVGPathElement>(this.CHART)?.setAttribute("d", plot?.line ?? "");
        document.querySelector<SVGPathElement>(this.AREA)?.setAttribute("d", plot?.area ?? "");

        const point: HTMLElement | null = document.querySelector<HTMLElement>(this.POINT);

        if (point) {
            point.style.cssText = plot?.marker ?? "";
            point.classList.toggle(this.HIDDEN, !plot?.marker);
        }
    }

    private deltas(deltas: Record<string, Delta | null>): void {
        document.querySelectorAll<HTMLElement>(this.DELTA).forEach((chip: HTMLElement) => {
            const key: string | undefined = chip.dataset.deltaKey;
            const delta: Delta | null = key ? deltas[key] : null;

            if (!delta) {
                chip.classList.add(this.HIDDEN);
                chip.textContent = "";
                chip.removeAttribute("aria-label");
                return;
            }

            chip.textContent = delta.text;
            chip.dataset.direction = delta.direction;
            chip.setAttribute("aria-label", delta.label);
            chip.classList.remove(this.HIDDEN);
        });
    }

    private baked(): Baked | null {
        const block: HTMLScriptElement | null = document.querySelector<HTMLScriptElement>(this.DATA);

        if (!block?.textContent) {
            return null;
        }

        try {
            return JSON.parse(block.textContent) as Baked;
        } catch {
            return null;
        }
    }
}

export const IMPACT_PERIOD_SWITCHER: ImpactPeriodSwitcher = new ImpactPeriodSwitcher();
