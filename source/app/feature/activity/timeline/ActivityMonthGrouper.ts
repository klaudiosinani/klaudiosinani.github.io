import type { MonthGrouper } from "@app/util/period/MonthGrouper";
import type { ActivityEntry } from "./ActivityEntry";
import { ActivityMonth } from "./ActivityMonth";
import type { MonthGroup } from "@app/util/period/MonthGroup";

export class ActivityMonthGrouper {
    private readonly monthGrouper: MonthGrouper;

    public constructor(monthGrouper: MonthGrouper) {
        this.monthGrouper = monthGrouper;
    }
    public group(entries: readonly ActivityEntry[]): ActivityMonth[] {
        return this.monthGrouper
            .group(entries, (activityEntry: ActivityEntry) => activityEntry.getOccurredAt())
            .map(
                (monthGroup: MonthGroup<ActivityEntry>) =>
                    new ActivityMonth(monthGroup.getName(), [...monthGroup.getItems()])
            );
    }
}
