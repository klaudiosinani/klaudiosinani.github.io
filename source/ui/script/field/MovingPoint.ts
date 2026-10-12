import type { FieldPoint } from "./FieldPoint";

export class MovingPoint {
    private x: number;
    private y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public approach(fieldPoint: FieldPoint, share: number): void {
        this.x += (fieldPoint.getX() - this.x) * share;
        this.y += (fieldPoint.getY() - this.y) * share;
    }

    public place(fieldPoint: FieldPoint): void {
        this.x = fieldPoint.getX();
        this.y = fieldPoint.getY();
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }
}
