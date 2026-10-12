export class BucketGrid {
    public columnsOf(bucketCount: number): number {
        return 2 ** Math.ceil(Math.log2(Math.max(1, bucketCount)) / 2);
    }

    public rowsOf(bucketCount: number): number {
        return Math.ceil(Math.max(1, bucketCount) / this.columnsOf(bucketCount));
    }
}
