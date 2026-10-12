import type { ContentEntry } from "./ContentEntry.ts";

export class ContentEntryPublicationFilter {
    public filter<T extends ContentEntry>(contentEntries: T[]): T[] {
        return contentEntries.filter((contentEntry: T) => this.isPublished(contentEntry));
    }

    private isPublished(contentEntry: ContentEntry): boolean {
        return !("draft" in contentEntry.data && contentEntry.data.draft);
    }
}
