import { describe, expect, it } from "vitest";
import { BucketGrid } from "@ui/script/field/scene/hash/BucketGrid";
import type { HashFrame } from "@ui/script/field/scene/hash/HashFrame";
import { HashTablePlanner } from "@ui/script/field/scene/hash/HashTablePlanner";

describe("HashTablePlanner", () => {
    const hashTablePlanner: HashTablePlanner = new HashTablePlanner();
    const hashFrames: HashFrame[] = hashTablePlanner.plan(12);

    it("givenEntries_whenPlanned_thenTheLastFrameHoldsEveryEntry", () => {
        const last: HashFrame = hashFrames[hashFrames.length - 1];

        expect(last.getEntries()).toBe(12);
        expect(last.getBuckets()).toHaveLength(12);
        expect(last.getDepths()).toHaveLength(12);
        expect(last.getBucketCount()).toBe(16);
    });

    it("givenALoadPastThreeQuarters_whenPlanned_thenTheTableDoubles", () => {
        const firstGrow: number = hashFrames.findIndex(
            (hashFrame: HashFrame) => hashFrame.getHashFrameKind() === "grow"
        );

        expect(hashFrames[firstGrow - 1].getBucketCount()).toBe(4);
        expect(hashFrames[firstGrow - 1].getEntries()).toBe(3);
        expect(hashFrames[firstGrow].getBucketCount()).toBe(8);
        expect(hashFrames[firstGrow + 1].getEntries()).toBe(4);
        expect(hashFrames[firstGrow + 1].getBucketCount()).toBe(8);
    });

    it("givenAnyFrame_whenRead_thenEveryBucketStandsInsideTheTable", () => {
        hashFrames.forEach((hashFrame: HashFrame) =>
            hashFrame.getBuckets().forEach((bucket: number) => {
                expect(bucket).toBeGreaterThanOrEqual(0);
                expect(bucket).toBeLessThan(hashFrame.getBucketCount());
            })
        );
    });

    it("givenAnyFrame_whenRead_thenTheDepthsOfEachBucketRunWithoutGaps", () => {
        hashFrames.forEach((hashFrame: HashFrame) => {
            const chains: Map<number, number[]> = new Map();

            hashFrame
                .getBuckets()
                .forEach((bucket: number, key: number) =>
                    chains.set(bucket, [...(chains.get(bucket) ?? []), hashFrame.getDepths()[key]])
                );
            chains.forEach((depths: number[]) =>
                expect([...depths].sort((first: number, second: number) => first - second)).toEqual(
                    depths.map((_: number, index: number) => index)
                )
            );
        });
    });
});

describe("BucketGrid", () => {
    const bucketGrid: BucketGrid = new BucketGrid();

    it("givenTheBucketCountsOfTheTable_whenArranged_thenEachCountFillsAWideGrid", () => {
        expect([8, 16, 32, 64].map((bucketCount: number) => bucketGrid.columnsOf(bucketCount))).toEqual([4, 4, 8, 8]);
        expect([8, 16, 32, 64].map((bucketCount: number) => bucketGrid.rowsOf(bucketCount))).toEqual([2, 4, 4, 8]);
    });

    it("givenOneBucket_whenArranged_thenOneCellHoldsIt", () => {
        expect(bucketGrid.columnsOf(1)).toBe(1);
        expect(bucketGrid.rowsOf(1)).toBe(1);
    });
});
