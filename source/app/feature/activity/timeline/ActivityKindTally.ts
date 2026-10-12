import type { ActivityEntry } from "./ActivityEntry";
import type { ActivityKind } from "./ActivityKind";

export class ActivityKindTally {
    public of(entries: readonly ActivityEntry[]): Record<ActivityKind, number> {
        return entries.reduce(
            (tally: { release: number; commit: number }, activityEntry: ActivityEntry) => ({
                ...tally,
                [activityEntry.getKind()]: tally[activityEntry.getKind()] + 1,
            }),
            { release: 0, commit: 0 }
        );
    }
}
