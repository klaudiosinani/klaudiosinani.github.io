import type { FieldPoint } from "./FieldPoint";
import type { LabelPlacement } from "./LabelPlacement";

export class FieldLabel {
    private readonly labelElement: HTMLElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly labelPlacement: LabelPlacement;
    private shownLabel: string = "";

    public constructor(labelElement: HTMLElement, canvas: HTMLCanvasElement, labelPlacement: LabelPlacement) {
        this.labelElement = labelElement;
        this.canvas = canvas;
        this.labelPlacement = labelPlacement;
    }

    public show(label: string, fieldPoint: FieldPoint): void {
        if (label !== this.shownLabel) {
            this.labelElement.textContent = label;
            this.shownLabel = label;
        }

        this.labelElement.hidden = false;

        const container: Element | null = this.labelElement.offsetParent;

        if (container === null) {
            return;
        }

        const canvasRect: DOMRect = this.canvas.getBoundingClientRect();
        const containerRect: DOMRect = container.getBoundingClientRect();
        const placed: FieldPoint = this.labelPlacement.place(
            fieldPoint,
            this.labelElement.offsetWidth,
            this.labelElement.offsetHeight,
            canvasRect.width,
            canvasRect.height
        );

        this.labelElement.style.left = `${canvasRect.left - containerRect.left - container.clientLeft + placed.getX()}px`;
        this.labelElement.style.top = `${canvasRect.top - containerRect.top - container.clientTop + placed.getY()}px`;
    }

    public hide(): void {
        this.labelElement.hidden = true;
    }
}
