export class ChartReadings {
    private readonly count: number;

    public constructor(count: number) {
        this.count = count;
    }

    public get empty(): boolean {
        return this.count === 0;
    }

    public get last(): number {
        return this.count - 1;
    }

    public at(fraction: number): number {
        return this.clamp(Math.round(fraction * this.last));
    }

    public clamp(index: number): number {
        return Math.min(Math.max(index, 0), this.last);
    }

    public across(index: number): number {
        return this.count > 1 ? index / this.last : 0;
    }
}
