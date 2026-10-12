import { FieldPoint } from "./FieldPoint";

export class LabelPlacement {
    private readonly GAP: number = 13;

    public place(
        fieldPoint: FieldPoint,
        labelWidth: number,
        labelHeight: number,
        areaWidth: number,
        areaHeight: number
    ): FieldPoint {
        const above: number = fieldPoint.getY() - this.GAP - labelHeight;
        const top: number = above >= 0 ? above : fieldPoint.getY() + this.GAP;

        return new FieldPoint(
            this.within(fieldPoint.getX() - labelWidth / 2, areaWidth - labelWidth),
            this.within(top, areaHeight - labelHeight)
        );
    }

    private within(start: number, largest: number): number {
        return Math.max(0, Math.min(start, largest));
    }
}
