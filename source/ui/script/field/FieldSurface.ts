export class FieldSurface {
    private readonly LARGEST_RATIO: number = 2;

    private readonly canvas: HTMLCanvasElement;
    private readonly canvasRenderingContext2D: CanvasRenderingContext2D;
    private width: number = 1;
    private height: number = 1;

    public constructor(canvas: HTMLCanvasElement, canvasRenderingContext2D: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.canvasRenderingContext2D = canvasRenderingContext2D;
    }

    public fit(): void {
        const ratio: number = Math.min(window.devicePixelRatio || 1, this.LARGEST_RATIO);
        const domRect: DOMRect = this.canvas.getBoundingClientRect();

        this.width = Math.max(1, Math.round(domRect.width));
        this.height = Math.max(1, Math.round(domRect.height));
        this.canvas.width = Math.round(this.width * ratio);
        this.canvas.height = Math.round(this.height * ratio);
        this.canvasRenderingContext2D.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    public clear(): void {
        this.canvasRenderingContext2D.clearRect(0, 0, this.width, this.height);
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getCanvasRenderingContext2D(): CanvasRenderingContext2D {
        return this.canvasRenderingContext2D;
    }
}
