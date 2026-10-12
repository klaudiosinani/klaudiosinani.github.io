import type { MergeFrameKind } from "./MergeFrameKind";

export class MergeFrame {
    private readonly order: readonly number[];
    private readonly from: number;
    private readonly to: number;
    private readonly width: number;
    private readonly mergeFrameKind: MergeFrameKind;

    public constructor(
        order: readonly number[],
        from: number,
        to: number,
        width: number,
        mergeFrameKind: MergeFrameKind
    ) {
        this.order = order;
        this.from = from;
        this.to = to;
        this.width = width;
        this.mergeFrameKind = mergeFrameKind;
    }

    public getOrder(): readonly number[] {
        return this.order;
    }

    public getFrom(): number {
        return this.from;
    }

    public getTo(): number {
        return this.to;
    }

    public getWidth(): number {
        return this.width;
    }

    public getMergeFrameKind(): MergeFrameKind {
        return this.mergeFrameKind;
    }
}
