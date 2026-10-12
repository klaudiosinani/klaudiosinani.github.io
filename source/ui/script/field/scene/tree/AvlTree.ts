import { AvlNode } from "./AvlNode";

export class AvlTree {
    private root: AvlNode | null = null;
    private size: number = 0;

    public insert(key: number, order: number): number[] {
        const path: number[] = [];

        this.root = this.insertInto(this.root, new AvlNode(key, order), path);
        this.size += 1;
        path.push(order);

        return path;
    }

    public getRoot(): AvlNode | null {
        return this.root;
    }

    public getSize(): number {
        return this.size;
    }

    private insertInto(current: AvlNode | null, avlNode: AvlNode, path: number[]): AvlNode {
        if (current === null) {
            return avlNode;
        }

        path.push(current.getOrder());

        if (avlNode.precedes(current)) {
            current.setLeft(this.insertInto(current.getLeft(), avlNode, path));
        } else {
            current.setRight(this.insertInto(current.getRight(), avlNode, path));
        }

        current.refresh();

        return this.rebalance(current);
    }

    private rebalance(avlNode: AvlNode): AvlNode {
        const balance: number = avlNode.balance();
        const left: AvlNode | null = avlNode.getLeft();
        const right: AvlNode | null = avlNode.getRight();

        if (balance > 1 && left !== null) {
            if (left.balance() < 0) {
                avlNode.setLeft(this.rotateLeft(left));
            }

            return this.rotateRight(avlNode);
        }

        if (balance < -1 && right !== null) {
            if (right.balance() > 0) {
                avlNode.setRight(this.rotateRight(right));
            }

            return this.rotateLeft(avlNode);
        }

        return avlNode;
    }

    private rotateRight(avlNode: AvlNode): AvlNode {
        const pivot: AvlNode | null = avlNode.getLeft();

        if (pivot === null) {
            return avlNode;
        }

        avlNode.setLeft(pivot.getRight());
        pivot.setRight(avlNode);
        avlNode.refresh();
        pivot.refresh();

        return pivot;
    }

    private rotateLeft(avlNode: AvlNode): AvlNode {
        const pivot: AvlNode | null = avlNode.getRight();

        if (pivot === null) {
            return avlNode;
        }

        avlNode.setRight(pivot.getLeft());
        pivot.setLeft(avlNode);
        avlNode.refresh();
        pivot.refresh();

        return pivot;
    }
}
