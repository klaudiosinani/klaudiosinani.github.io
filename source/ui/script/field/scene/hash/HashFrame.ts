import type { HashFrameKind } from "./HashFrameKind";

export class HashFrame {
    private readonly bucketCount: number;
    private readonly buckets: readonly number[];
    private readonly depths: readonly number[];
    private readonly entries: number;
    private readonly hashFrameKind: HashFrameKind;

    public constructor(
        bucketCount: number,
        buckets: readonly number[],
        depths: readonly number[],
        entries: number,
        hashFrameKind: HashFrameKind
    ) {
        this.bucketCount = bucketCount;
        this.buckets = buckets;
        this.depths = depths;
        this.entries = entries;
        this.hashFrameKind = hashFrameKind;
    }

    public getBucketCount(): number {
        return this.bucketCount;
    }

    public getBuckets(): readonly number[] {
        return this.buckets;
    }

    public getDepths(): readonly number[] {
        return this.depths;
    }

    public getEntries(): number {
        return this.entries;
    }

    public getHashFrameKind(): HashFrameKind {
        return this.hashFrameKind;
    }
}
