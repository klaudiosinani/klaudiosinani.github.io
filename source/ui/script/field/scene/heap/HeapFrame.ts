import type { HeapFrameKind } from "./HeapFrameKind";

export class HeapFrame {
    private readonly order: readonly number[];
    private readonly heapSize: number;
    private readonly focus: readonly number[];
    private readonly heapFrameKind: HeapFrameKind;
    private readonly item: number;

    public constructor(
        order: readonly number[],
        heapSize: number,
        focus: readonly number[],
        heapFrameKind: HeapFrameKind,
        item: number
    ) {
        this.order = order;
        this.heapSize = heapSize;
        this.focus = focus;
        this.heapFrameKind = heapFrameKind;
        this.item = item;
    }

    public getOrder(): readonly number[] {
        return this.order;
    }

    public getHeapSize(): number {
        return this.heapSize;
    }

    public getFocus(): readonly number[] {
        return this.focus;
    }

    public getHeapFrameKind(): HeapFrameKind {
        return this.heapFrameKind;
    }

    public getItem(): number {
        return this.item;
    }
}
