import type { ContentEntry } from "./ContentEntry.ts";

export class ContentEntryOrderComparator {
    public compare(first: ContentEntry, second: ContentEntry): number {
        return first.data.order - second.data.order;
    }
}
