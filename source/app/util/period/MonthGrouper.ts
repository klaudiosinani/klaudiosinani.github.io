import type { MonthGroup } from "./MonthGroup";
import type { MonthGroupFactory } from "./MonthGroupFactory";
export class MonthGrouper {
    private readonly FORMAT: Intl.DateTimeFormat = new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });

    private readonly monthGroupFactory: MonthGroupFactory;

    public constructor(monthGroupFactory: MonthGroupFactory) {
        this.monthGroupFactory = monthGroupFactory;
    }

    public group<T>(items: readonly T[], at: (item: T) => string): MonthGroup<T>[] {
        const months: MonthGroup<T>[] = [];

        let openName: string | null = null;
        let openItems: T[] = [];

        for (const item of items) {
            const name: string = this.FORMAT.format(new Date(at(item)));

            if (openName === name) {
                openItems.push(item);

                continue;
            }

            if (openName !== null) {
                months.push(this.monthGroupFactory.create(openName, openItems));
            }

            openName = name;
            openItems = [item];
        }

        if (openName !== null) {
            months.push(this.monthGroupFactory.create(openName, openItems));
        }

        return months;
    }
}
