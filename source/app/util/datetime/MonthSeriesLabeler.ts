export class MonthSeriesLabeler {
    private readonly MONTHS_IN_YEAR: number = 12;
    private readonly MONTH_NAMES: readonly string[] = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    public label(startYear: number, count: number): string[] {
        return Array.from({ length: count }, (_: unknown, index: number) => {
            const year: number = startYear + Math.floor(index / this.MONTHS_IN_YEAR);

            return `${this.MONTH_NAMES[index % this.MONTHS_IN_YEAR]} ${year}`;
        });
    }
}
