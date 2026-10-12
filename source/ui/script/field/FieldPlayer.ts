import type { FieldPalette } from "./FieldPalette";
import type { FieldPaletteReader } from "./FieldPaletteReader";
import type { FieldScene } from "./FieldScene";
import type { FieldSceneKey } from "./FieldSceneKey";
import type { FieldStep } from "./FieldStep";
import type { FieldSurface } from "./FieldSurface";
import { FieldLabel } from "./FieldLabel";
import { FieldLoop } from "./FieldLoop";
import { FieldPoint } from "./FieldPoint";
import { FieldTicker } from "./FieldTicker";
import { LabelPlacement } from "./LabelPlacement";
import { TickerPace } from "./TickerPace";

export class FieldPlayer implements FieldStep {
    private readonly REDUCED_MOTION: string = "(prefers-reduced-motion: reduce)";
    private readonly TOUCH: string = "touch";

    private readonly stage: HTMLElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly fieldSurface: FieldSurface;
    private readonly fieldScene: FieldScene;
    private readonly fieldPaletteReader: FieldPaletteReader;
    private readonly fieldLoop: FieldLoop;
    private fieldPalette: FieldPalette;
    private fieldTicker: FieldTicker | null = null;
    private fieldLabel: FieldLabel | null = null;
    private probe: FieldPoint | null = null;
    private onScreen: boolean = true;
    private pageShown: boolean = true;
    private still: boolean = false;

    public constructor(
        stage: HTMLElement,
        canvas: HTMLCanvasElement,
        fieldSurface: FieldSurface,
        fieldScene: FieldScene,
        fieldPaletteReader: FieldPaletteReader
    ) {
        this.stage = stage;
        this.canvas = canvas;
        this.fieldSurface = fieldSurface;
        this.fieldScene = fieldScene;
        this.fieldPaletteReader = fieldPaletteReader;
        this.fieldLoop = new FieldLoop(this);
        this.fieldPalette = fieldPaletteReader.read();
    }

    public play(fieldSceneKey: FieldSceneKey): void {
        const switchButton: HTMLButtonElement | null = this.stage.querySelector("button[data-field-switch]");
        const tickerElement: HTMLElement | null = this.stage.querySelector("[data-field-ticker]");
        const labelElement: HTMLElement | null = this.stage.querySelector("[data-field-label]");

        this.fieldTicker = tickerElement === null ? null : new FieldTicker(tickerElement, new TickerPace());
        this.fieldLabel =
            labelElement === null ? null : new FieldLabel(labelElement, this.canvas, new LabelPlacement());
        this.reveal(fieldSceneKey);
        this.listen();
        this.fit();
        new ResizeObserver(() => this.refit()).observe(this.canvas);
        new MutationObserver(() => this.repaint()).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        if (window.matchMedia(this.REDUCED_MOTION).matches) {
            this.still = true;
            this.fieldScene.settle();
            this.paint();
            switchButton?.setAttribute("hidden", "");

            return;
        }

        new IntersectionObserver((intersectionObserverEntries: IntersectionObserverEntry[]) => {
            this.onScreen = intersectionObserverEntries.some(
                (intersectionObserverEntry: IntersectionObserverEntry) => intersectionObserverEntry.isIntersecting
            );
            this.fieldLoop.show(this.onScreen && this.pageShown);
        }).observe(this.canvas);
        document.addEventListener("visibilitychange", () => {
            this.pageShown = document.visibilityState === "visible";
            this.fieldLoop.show(this.onScreen && this.pageShown);
        });
        switchButton?.addEventListener("click", () => this.toggle(switchButton));
        this.fieldLoop.start();
    }

    public step(seconds: number): void {
        this.fieldScene.advance(seconds);
        this.paint();
    }

    private toggle(switchButton: HTMLButtonElement): void {
        if (this.fieldLoop.isRunning()) {
            this.fieldLoop.stop();
            switchButton.setAttribute("aria-pressed", "true");
        } else {
            this.fieldLoop.start();
            switchButton.setAttribute("aria-pressed", "false");
        }
    }

    private listen(): void {
        this.canvas.addEventListener("pointermove", (pointerEvent: PointerEvent) => {
            if (pointerEvent.pointerType !== this.TOUCH) {
                this.point(pointerEvent);
            }
        });
        this.canvas.addEventListener("pointerleave", (pointerEvent: PointerEvent) => {
            if (pointerEvent.pointerType !== this.TOUCH) {
                this.release();
            }
        });
        this.canvas.addEventListener("pointerup", (pointerEvent: PointerEvent) => {
            if (pointerEvent.pointerType === this.TOUCH) {
                this.point(pointerEvent);
            }
        });
        document.addEventListener("pointerdown", (pointerEvent: PointerEvent) => {
            if (pointerEvent.target !== this.canvas) {
                this.release();
            }
        });
    }

    private point(pointerEvent: PointerEvent): void {
        const domRect: DOMRect = this.canvas.getBoundingClientRect();

        this.probe = new FieldPoint(pointerEvent.clientX - domRect.left, pointerEvent.clientY - domRect.top);
        this.fieldScene.point(this.probe);
        this.answer();
    }

    private release(): void {
        if (this.probe === null) {
            return;
        }

        this.probe = null;
        this.fieldScene.point(null);
        this.fieldLabel?.hide();
        this.answer();
    }

    private answer(): void {
        if (this.fieldLoop.isRunning() && !this.still) {
            this.read();
        } else {
            this.paint();
        }
    }

    private read(): void {
        if (this.probe === null) {
            return;
        }

        const label: string | null = this.fieldScene.labelAt(this.probe);

        if (label === null) {
            this.fieldLabel?.hide();
        } else {
            this.fieldLabel?.show(label, this.probe);
        }
    }

    private reveal(fieldSceneKey: FieldSceneKey): void {
        const captionElement: HTMLElement | null = this.stage.querySelector("[data-field-caption]");

        this.stage.dataset.fieldShown = fieldSceneKey;

        if (captionElement !== null) {
            captionElement.textContent = this.fieldScene.caption();
        }

        this.stage.querySelector<HTMLElement>("[data-field-note]")?.removeAttribute("hidden");
    }

    private fit(): void {
        this.fieldSurface.fit();
        this.fieldScene.layout(this.fieldSurface.getWidth(), this.fieldSurface.getHeight());
    }

    private refit(): void {
        this.fit();

        if (this.still) {
            this.fieldScene.settle();
        }

        if (!this.fieldLoop.isRunning()) {
            this.paint();
        }
    }

    private repaint(): void {
        this.fieldPalette = this.fieldPaletteReader.read();

        if (!this.fieldLoop.isRunning()) {
            this.paint();
        }
    }

    private paint(): void {
        this.fieldSurface.clear();
        this.fieldScene.draw(this.fieldSurface.getCanvasRenderingContext2D(), this.fieldPalette);
        this.fieldTicker?.show(this.fieldScene.ticker(), !this.still);
        this.read();
    }
}
