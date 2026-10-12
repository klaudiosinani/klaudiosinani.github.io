import { describe, expect, it } from "vitest";
import { AvlTree } from "@ui/script/field/scene/tree/AvlTree";
import { AvlTreeLayout } from "@ui/script/field/scene/tree/AvlTreeLayout";
import { FieldBox } from "@ui/script/field/FieldBox";
import type { FieldPoint } from "@ui/script/field/FieldPoint";
import type { TreeArrangement } from "@ui/script/field/scene/tree/TreeArrangement";

describe("AvlTreeLayout", () => {
    const avlTreeLayout: AvlTreeLayout = new AvlTreeLayout();

    it("givenATree_whenArranging_thenTheRootStandsOnTopAndEachNodeHasAPlace", () => {
        const avlTree: AvlTree = new AvlTree();

        [5, 3, 8, 1, 4].forEach((key: number, order: number) => avlTree.insert(key, order));

        const treeArrangement: TreeArrangement = avlTreeLayout.arrange(avlTree, new FieldBox(100, 20, 500, 160), 9);
        const rootPoint: FieldPoint | undefined = treeArrangement.getPositions().get(0);

        expect(treeArrangement.getPositions().size).toBe(5);
        expect(treeArrangement.getTreeEdges()).toHaveLength(4);
        expect(rootPoint?.getY()).toBe(20);
    });

    it("givenATree_whenArranging_thenTheSmallerKeyStandsFurtherLeft", () => {
        const avlTree: AvlTree = new AvlTree();

        avlTree.insert(10, 0);
        avlTree.insert(2, 1);
        avlTree.insert(30, 2);

        const treeArrangement: TreeArrangement = avlTreeLayout.arrange(avlTree, new FieldBox(0, 0, 300, 100), 9);

        expect(treeArrangement.getPositions().get(1)?.getX()).toBeLessThan(
            treeArrangement.getPositions().get(0)?.getX() ?? 0
        );
        expect(treeArrangement.getPositions().get(2)?.getX()).toBeGreaterThan(
            treeArrangement.getPositions().get(0)?.getX() ?? 0
        );
    });
});
