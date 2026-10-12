export class TickerPace {
    private readonly LONGEST: number = 320;
    private readonly SHORTEST: number = 120;
    private readonly SHARE: number = 0.5;

    public durationAfter(interval: number | null): number {
        if (interval === null) {
            return this.LONGEST;
        }

        return Math.min(this.LONGEST, Math.max(this.SHORTEST, interval * this.SHARE));
    }
}
