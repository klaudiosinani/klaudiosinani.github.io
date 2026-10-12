import { HeapFrame } from "./HeapFrame";

export class HeapPlanner {
    public plan(keys: readonly number[]): HeapFrame[] {
        const order: number[] = [];
        const heapFrames: HeapFrame[] = [];

        keys.forEach((_: number, item: number) => {
            order.push(item);
            heapFrames.push(new HeapFrame([...order], order.length, [order.length - 1], "insert", item));
            this.rise(order, keys, heapFrames);
        });

        for (let heapSize: number = order.length - 1; heapSize > 0; heapSize -= 1) {
            this.swap(order, 0, heapSize);
            heapFrames.push(new HeapFrame([...order], heapSize, [heapSize], "take", order[heapSize]));
            this.sink(order, keys, heapSize, heapFrames);
        }

        if (order.length > 0) {
            heapFrames.push(new HeapFrame([...order], 0, [0], "take", order[0]));
        }

        return heapFrames;
    }

    private rise(order: number[], keys: readonly number[], heapFrames: HeapFrame[]): void {
        let slot: number = order.length - 1;
        let parent: number = Math.floor((slot - 1) / 2);

        while (slot > 0 && keys[order[parent]] < keys[order[slot]]) {
            this.swap(order, slot, parent);
            heapFrames.push(new HeapFrame([...order], order.length, [parent, slot], "rise", order[parent]));
            slot = parent;
            parent = Math.floor((slot - 1) / 2);
        }
    }

    private sink(order: number[], keys: readonly number[], heapSize: number, heapFrames: HeapFrame[]): void {
        let slot: number = 0;
        let largest: number = this.largestOf(order, keys, heapSize, slot);

        while (largest !== slot) {
            this.swap(order, slot, largest);
            heapFrames.push(new HeapFrame([...order], heapSize, [slot, largest], "sink", order[largest]));
            slot = largest;
            largest = this.largestOf(order, keys, heapSize, slot);
        }
    }

    private largestOf(order: readonly number[], keys: readonly number[], heapSize: number, slot: number): number {
        const left: number = 2 * slot + 1;
        const right: number = left + 1;
        let largest: number = slot;

        if (left < heapSize && keys[order[left]] > keys[order[largest]]) {
            largest = left;
        }

        if (right < heapSize && keys[order[right]] > keys[order[largest]]) {
            largest = right;
        }

        return largest;
    }

    private swap(order: number[], first: number, second: number): void {
        const held: number = order[first];

        order[first] = order[second];
        order[second] = held;
    }
}
