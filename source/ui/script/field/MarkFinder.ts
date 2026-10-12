import type { FieldBox } from "./FieldBox";
import type { FieldPoint } from "./FieldPoint";

export class MarkFinder {
    public nearest(fieldPoints: readonly FieldPoint[], probe: FieldPoint, reach: number): number | null {
        let found: number | null = null;
        let closest: number = reach;

        for (let index: number = 0; index < fieldPoints.length; index += 1) {
            const distance: number = Math.hypot(
                fieldPoints[index].getX() - probe.getX(),
                fieldPoints[index].getY() - probe.getY()
            );

            if (distance <= closest) {
                closest = distance;
                found = index;
            }
        }

        return found;
    }

    public holding(fieldBoxes: readonly FieldBox[], probe: FieldPoint): number | null {
        const found: number = fieldBoxes.findIndex(
            (fieldBox: FieldBox) =>
                probe.getX() >= fieldBox.getLeft() &&
                probe.getX() < fieldBox.getLeft() + fieldBox.getWidth() &&
                probe.getY() >= fieldBox.getTop() &&
                probe.getY() <= fieldBox.getTop() + fieldBox.getHeight()
        );

        return found === -1 ? null : found;
    }
}
