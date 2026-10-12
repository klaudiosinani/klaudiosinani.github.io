import { describe, expect, it } from "vitest";
import type { HeapFrame } from "@ui/script/field/scene/heap/HeapFrame";
import { HeapPlanner } from "@ui/script/field/scene/heap/HeapPlanner";

const isHeap = (order: readonly number[], keys: readonly number[], heapSize: number): boolean =>
    order.slice(1, heapSize).every((item: number, index: number) => keys[order[Math.floor(index / 2)]] >= keys[item]);

describe("HeapPlanner", () => {
    const keys: number[] = [297, 395, 169, 624, 245, 562, 218, 187, 106, 160];
    const heapFrames: HeapFrame[] = new HeapPlanner().plan(keys);

    it("givenCommits_whenEveryItemIsIn_thenTheArrayHoldsAMaxHeap", () => {
        const built: HeapFrame | undefined = heapFrames.find(
            (heapFrame: HeapFrame) => heapFrame.getHeapFrameKind() === "take"
        );
        const before: HeapFrame = heapFrames[heapFrames.indexOf(built as HeapFrame) - 1];

        expect(before.getHeapSize()).toBe(keys.length);
        expect(isHeap(before.getOrder(), keys, before.getHeapSize())).toBe(true);
    });

    it("givenCommits_whenHeapsortEnds_thenTheItemsStandInRisingOrder", () => {
        const last: HeapFrame = heapFrames[heapFrames.length - 1];

        expect(last.getHeapSize()).toBe(0);
        expect(last.getOrder().map((item: number) => keys[item])).toEqual(
            [...keys].sort((first: number, second: number) => first - second)
        );
    });

    it("givenAnyFrame_whenRead_thenTheOrderHoldsEachItemOnce", () => {
        heapFrames.forEach((heapFrame: HeapFrame) =>
            expect(new Set(heapFrame.getOrder()).size).toBe(heapFrame.getOrder().length)
        );
    });
});
