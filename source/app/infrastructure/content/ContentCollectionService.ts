import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { ContentEntryOrderComparator } from "./entry/ContentEntryOrderComparator.ts";
import type { ContentEntryPublicationFilter } from "./entry/ContentEntryPublicationFilter.ts";
import type { OrderedCollectionKey } from "./entry/OrderedCollectionKey.ts";

export class ContentCollectionService {
    private readonly contentEntryPublicationFilter: ContentEntryPublicationFilter;
    private readonly contentEntryOrderComparator: ContentEntryOrderComparator;

    public constructor(
        contentEntryPublicationFilter: ContentEntryPublicationFilter,
        contentEntryOrderComparator: ContentEntryOrderComparator
    ) {
        this.contentEntryPublicationFilter = contentEntryPublicationFilter;
        this.contentEntryOrderComparator = contentEntryOrderComparator;
    }

    public async getEntries<Key extends OrderedCollectionKey>(collectionName: Key): Promise<CollectionEntry<Key>[]> {
        const contentEntries: CollectionEntry<Key>[] = (await getCollection(collectionName)) as CollectionEntry<Key>[];

        const publishedContentEntries: CollectionEntry<Key>[] =
            this.contentEntryPublicationFilter.filter(contentEntries);

        return publishedContentEntries.sort((first: CollectionEntry<Key>, second: CollectionEntry<Key>) =>
            this.contentEntryOrderComparator.compare(first, second)
        );
    }

    public async getData<Key extends OrderedCollectionKey>(
        collectionName: Key
    ): Promise<CollectionEntry<Key>["data"][]> {
        const contentEntries: CollectionEntry<Key>[] = await this.getEntries(collectionName);

        return contentEntries.map((contentEntry: CollectionEntry<Key>) => contentEntry.data);
    }
}
