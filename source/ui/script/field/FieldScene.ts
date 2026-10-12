import type { FieldPalette } from "./FieldPalette";
import type { FieldPoint } from "./FieldPoint";

export interface FieldScene {
    layout(width: number, height: number): void;
    advance(seconds: number): void;
    settle(): void;
    draw(canvasRenderingContext2D: CanvasRenderingContext2D, fieldPalette: FieldPalette): void;
    caption(): string;
    ticker(): string;
    labelAt(fieldPoint: FieldPoint): string | null;
    point(fieldPoint: FieldPoint | null): void;
}
