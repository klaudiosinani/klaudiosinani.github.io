export class AvlNode {
    private readonly key: number;
    private readonly order: number;
    private left: AvlNode | null = null;
    private right: AvlNode | null = null;
    private height: number = 1;

    public constructor(key: number, order: number) {
        this.key = key;
        this.order = order;
    }

    public precedes(avlNode: AvlNode): boolean {
        return this.key < avlNode.key || (this.key === avlNode.key && this.order < avlNode.order);
    }

    public refresh(): void {
        this.height = 1 + Math.max(this.heightOf(this.left), this.heightOf(this.right));
    }

    public balance(): number {
        return this.heightOf(this.left) - this.heightOf(this.right);
    }

    public getKey(): number {
        return this.key;
    }

    public getOrder(): number {
        return this.order;
    }

    public getLeft(): AvlNode | null {
        return this.left;
    }

    public setLeft(avlNode: AvlNode | null): void {
        this.left = avlNode;
    }

    public getRight(): AvlNode | null {
        return this.right;
    }

    public setRight(avlNode: AvlNode | null): void {
        this.right = avlNode;
    }

    public getHeight(): number {
        return this.height;
    }

    private heightOf(avlNode: AvlNode | null): number {
        return avlNode === null ? 0 : avlNode.getHeight();
    }
}
