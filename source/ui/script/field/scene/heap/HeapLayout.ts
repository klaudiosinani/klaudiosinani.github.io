import type { FieldBox } from "../../FieldBox";
import { FieldPoint } from "../../FieldPoint";

export class HeapLayout {
    public treePoint(slot: number, fieldBox: FieldBox, levels: number): FieldPoint {
        const depth: number = Math.floor(Math.log2(slot + 1));
        const across: number = 2 ** depth;
        const position: number = slot + 1 - across;

        return new FieldPoint(
            fieldBox.getLeft() + ((position + 0.5) / across) * fieldBox.getWidth(),
            fieldBox.getTop() + (depth / Math.max(1, levels - 1)) * fieldBox.getHeight()
        );
    }

    public arrayPoint(slot: number, count: number, fieldBox: FieldBox): FieldPoint {
        return new FieldPoint(
            fieldBox.getLeft() + ((slot + 0.5) / Math.max(1, count)) * fieldBox.getWidth(),
            fieldBox.getTop() + fieldBox.getHeight()
        );
    }
}
