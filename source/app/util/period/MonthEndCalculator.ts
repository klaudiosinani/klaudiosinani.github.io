export class MonthEndCalculator {
    public endOf(year: number, month: number): Date {
        return new Date(Date.UTC(year, month, 0));
    }

    public shiftBack(monthEnd: Date, months: number): Date {
        return this.endOf(monthEnd.getUTCFullYear(), monthEnd.getUTCMonth() + 1 - months);
    }
}
