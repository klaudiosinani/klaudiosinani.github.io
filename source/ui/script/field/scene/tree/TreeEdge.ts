export class TreeEdge {
    private readonly parentOrder: number;
    private readonly childOrder: number;

    public constructor(parentOrder: number, childOrder: number) {
        this.parentOrder = parentOrder;
        this.childOrder = childOrder;
    }

    public getParentOrder(): number {
        return this.parentOrder;
    }

    public getChildOrder(): number {
        return this.childOrder;
    }
}
