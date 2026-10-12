import { describe, expect, it } from "vitest";
import type { AvlNode } from "@ui/script/field/scene/tree/AvlNode";
import { AvlTree } from "@ui/script/field/scene/tree/AvlTree";

const keysInOrder = (avlNode: AvlNode | null): number[] =>
    avlNode === null ? [] : [...keysInOrder(avlNode.getLeft()), avlNode.getKey(), ...keysInOrder(avlNode.getRight())];

const isBalanced = (avlNode: AvlNode | null): boolean =>
    avlNode === null ||
    (Math.abs(avlNode.balance()) <= 1 && isBalanced(avlNode.getLeft()) && isBalanced(avlNode.getRight()));

describe("AvlTree", () => {
    it("givenRisingKeys_whenInserting_thenTheTreeStaysBalanced", () => {
        const avlTree: AvlTree = new AvlTree();

        for (let order: number = 0; order < 105; order += 1) {
            avlTree.insert(order * 1_000, order);
        }

        expect(avlTree.getSize()).toBe(105);
        expect(isBalanced(avlTree.getRoot())).toBe(true);
        expect(avlTree.getRoot()?.getHeight()).toBeLessThanOrEqual(Math.ceil(1.44 * Math.log2(107)));
    });

    it("givenAnyKeys_whenInserting_thenTheKeysReadInOrder", () => {
        const avlTree: AvlTree = new AvlTree();
        const keys: number[] = [13_916_365, 3_619, 8_047, 12_562_041, 2_452, 8_047];

        keys.forEach((key: number, order: number) => avlTree.insert(key, order));

        expect(keysInOrder(avlTree.getRoot())).toEqual(
            [...keys].sort((first: number, second: number) => first - second)
        );
    });

    it("givenAnInsert_whenItEnds_thenThePathEndsInTheNewNode", () => {
        const avlTree: AvlTree = new AvlTree();

        avlTree.insert(50, 0);
        avlTree.insert(20, 1);

        expect(avlTree.insert(30, 2)).toEqual([0, 1, 2]);
    });
});
