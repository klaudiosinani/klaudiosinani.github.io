import { HashFrame } from "./HashFrame";

export class HashTablePlanner {
    private readonly MULTIPLIER: number = 2654435761;
    private readonly RANGE: number = 4294967296;
    private readonly FIRST_BUCKETS: number = 4;
    private readonly LOAD_LIMIT: number = 0.75;

    public plan(count: number): HashFrame[] {
        const hashFrames: HashFrame[] = [];
        let bucketCount: number = this.FIRST_BUCKETS;

        for (let entries: number = 1; entries <= count; entries += 1) {
            if (entries > this.LOAD_LIMIT * bucketCount) {
                bucketCount *= 2;
                hashFrames.push(this.frameOf(entries - 1, bucketCount, "grow"));
            }

            hashFrames.push(this.frameOf(entries, bucketCount, "insert"));
        }

        return hashFrames;
    }

    public bucketOf(key: number, bucketCount: number): number {
        return Math.floor((((key * this.MULTIPLIER) % this.RANGE) / this.RANGE) * bucketCount);
    }

    private frameOf(entries: number, bucketCount: number, hashFrameKind: "insert" | "grow"): HashFrame {
        const buckets: number[] = [];
        const depths: number[] = [];
        const fill: number[] = Array.from({ length: bucketCount }, () => 0);

        for (let key: number = 0; key < entries; key += 1) {
            const bucket: number = this.bucketOf(key + 1, bucketCount);

            buckets.push(bucket);
            depths.push(fill[bucket]);
            fill[bucket] += 1;
        }

        return new HashFrame(bucketCount, buckets, depths, entries, hashFrameKind);
    }
}
