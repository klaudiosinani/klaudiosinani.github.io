import { describe, expect, it } from "vitest";
import type { MergeFrame } from "@ui/script/field/scene/merge/MergeFrame";
import { MergeSortPlanner } from "@ui/script/field/scene/merge/MergeSortPlanner";

describe("MergeSortPlanner", () => {
    const keys: number[] = [3_619, 2_452, 3_190, 4_109, 8_047, 13_916_365, 12_562_041, 2_452, 999];
    const mergeFrames: MergeFrame[] = new MergeSortPlanner().plan(keys);

    it("givenMonths_whenSorted_thenTheSortedFrameReadsInRisingOrder", () => {
        const sorted: MergeFrame | undefined = mergeFrames.find(
            (mergeFrame: MergeFrame) => mergeFrame.getMergeFrameKind() === "sorted"
        );

        expect(sorted?.getOrder().map((item: number) => keys[item])).toEqual(
            [...keys].sort((first: number, second: number) => first - second)
        );
    });

    it("givenMonths_whenTheSortEnds_thenTheMonthsReturnToTheCalendar", () => {
        expect(mergeFrames[mergeFrames.length - 1].getOrder()).toEqual(keys.map((_: number, index: number) => index));
    });

    it("givenAMerge_whenRead_thenOnlyItsRangeMoves", () => {
        const merge: MergeFrame = mergeFrames[1];

        expect(merge.getMergeFrameKind()).toBe("merge");
        expect(merge.getOrder().slice(merge.getTo())).toEqual(mergeFrames[0].getOrder().slice(merge.getTo()));
    });
});
