import type { FieldPoint } from "../../FieldPoint";
import type { TreeEdge } from "./TreeEdge";

export class TreeArrangement {
    private readonly positions: ReadonlyMap<number, FieldPoint>;
    private readonly treeEdges: readonly TreeEdge[];

    public constructor(positions: ReadonlyMap<number, FieldPoint>, treeEdges: readonly TreeEdge[]) {
        this.positions = positions;
        this.treeEdges = treeEdges;
    }

    public getPositions(): ReadonlyMap<number, FieldPoint> {
        return this.positions;
    }

    public getTreeEdges(): readonly TreeEdge[] {
        return this.treeEdges;
    }
}
