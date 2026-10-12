import { MergeFrame } from "./MergeFrame";

export class MergeSortPlanner {
    public plan(keys: readonly number[]): MergeFrame[] {
        const count: number = keys.length;
        const chronological: number[] = keys.map((_: number, item: number) => item);
        let order: number[] = [...chronological];
        const mergeFrames: MergeFrame[] = [new MergeFrame([...order], 0, 0, 1, "start")];

        for (let width: number = 1; width < count; width *= 2) {
            for (let from: number = 0; from + width < count; from += 2 * width) {
                const to: number = Math.min(from + 2 * width, count);

                order = this.merged(order, keys, from, from + width, to);
                mergeFrames.push(new MergeFrame([...order], from, to, width, "merge"));
            }
        }

        mergeFrames.push(new MergeFrame([...order], 0, count, count, "sorted"));
        mergeFrames.push(new MergeFrame(chronological, 0, count, count, "return"));

        return mergeFrames;
    }

    private merged(
        order: readonly number[],
        keys: readonly number[],
        from: number,
        middle: number,
        to: number
    ): number[] {
        const result: number[] = order.slice(0, from);
        let left: number = from;
        let right: number = middle;

        while (left < middle || right < to) {
            const takeLeft: boolean = right >= to || (left < middle && keys[order[left]] <= keys[order[right]]);

            result.push(takeLeft ? order[left] : order[right]);
            left += takeLeft ? 1 : 0;
            right += takeLeft ? 0 : 1;
        }

        return [...result, ...order.slice(to)];
    }
}
