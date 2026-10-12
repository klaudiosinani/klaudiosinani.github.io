import type { AvlNode } from "./AvlNode";
import type { AvlTree } from "./AvlTree";
import type { FieldBox } from "../../FieldBox";
import { FieldPoint } from "../../FieldPoint";
import { TreeArrangement } from "./TreeArrangement";
import { TreeEdge } from "./TreeEdge";

export class AvlTreeLayout {
    public arrange(avlTree: AvlTree, fieldBox: FieldBox, levels: number): TreeArrangement {
        const avlNodes: AvlNode[] = [];
        const depths: Map<number, number> = new Map();
        const treeEdges: TreeEdge[] = [];
        const gap: number = fieldBox.getHeight() / Math.max(1, levels - 1);
        const positions: Map<number, FieldPoint> = new Map();

        this.walk(avlTree.getRoot(), 0, avlNodes, depths, treeEdges);
        avlNodes.forEach((avlNode: AvlNode, rank: number) =>
            positions.set(
                avlNode.getOrder(),
                new FieldPoint(
                    fieldBox.getLeft() + ((rank + 0.5) / avlNodes.length) * fieldBox.getWidth(),
                    fieldBox.getTop() + (depths.get(avlNode.getOrder()) ?? 0) * gap
                )
            )
        );

        return new TreeArrangement(positions, treeEdges);
    }

    private walk(
        avlNode: AvlNode | null,
        depth: number,
        avlNodes: AvlNode[],
        depths: Map<number, number>,
        treeEdges: TreeEdge[]
    ): void {
        if (avlNode === null) {
            return;
        }

        const left: AvlNode | null = avlNode.getLeft();
        const right: AvlNode | null = avlNode.getRight();

        if (left !== null) {
            treeEdges.push(new TreeEdge(avlNode.getOrder(), left.getOrder()));
        }

        if (right !== null) {
            treeEdges.push(new TreeEdge(avlNode.getOrder(), right.getOrder()));
        }

        this.walk(left, depth + 1, avlNodes, depths, treeEdges);
        avlNodes.push(avlNode);
        depths.set(avlNode.getOrder(), depth);
        this.walk(right, depth + 1, avlNodes, depths, treeEdges);
    }
}
