import type { MonthEndCalculator } from "./MonthEndCalculator";

export class LastCompleteMonthResolver {
    private readonly MONTH_LENGTH: number = 7;
    private readonly DAY_LENGTH: number = 10;
    private readonly monthEndCalculator: MonthEndCalculator;

    public constructor(monthEndCalculator: MonthEndCalculator) {
        this.monthEndCalculator = monthEndCalculator;
    }

    public resolve(lastPublishedDay: string | null): Date | null {
        if (!lastPublishedDay) {
            return null;
        }

        const year: number = Number(lastPublishedDay.slice(0, 4));
        const month: number = Number(lastPublishedDay.slice(5, this.MONTH_LENGTH));
        const endOfThatMonth: Date = this.monthEndCalculator.endOf(year, month);

        if (lastPublishedDay >= endOfThatMonth.toISOString().slice(0, this.DAY_LENGTH)) {
            return endOfThatMonth;
        }

        return this.monthEndCalculator.endOf(year, month - 1);
    }
}
