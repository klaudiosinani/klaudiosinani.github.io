import { MonthGroup } from "./MonthGroup";

export class MonthGroupFactory {
    public create<T>(name: string, items: readonly T[]): MonthGroup<T> {
        return new MonthGroup<T>(name, items);
    }
}
