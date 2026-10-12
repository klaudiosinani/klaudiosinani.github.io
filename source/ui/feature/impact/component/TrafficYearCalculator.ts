export class TrafficYearCalculator {
    private readonly WINDOW_WEEKS: number = 2;
    private readonly YEAR_WEEKS: number = 52;

    public compute(windowCount: number): number {
        return (windowCount * this.YEAR_WEEKS) / this.WINDOW_WEEKS;
    }
}

export const TRAFFIC_YEAR_CALCULATOR: TrafficYearCalculator = new TrafficYearCalculator();
