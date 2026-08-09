import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { OrderedCollectionKey } from "./OrderedCollectionKey";
import type { RenderedSection } from "./RenderedSection";
import type { TitledCollectionKey } from "./TitledCollectionKey";

type OrderedEntry<Key extends OrderedCollectionKey> = CollectionEntry<Key>;
type AnyOrderedEntry = OrderedEntry<OrderedCollectionKey>;

export class ContentRetrievalService {
  public async entries<Key extends OrderedCollectionKey>(
    collectionName: Key
  ): Promise<OrderedEntry<Key>[]> {
    const entries = (await getCollection(
      collectionName
    )) as OrderedEntry<Key>[];

    return entries
      .filter(entry => ContentRetrievalService.isPublished(entry))
      .sort((first, second) => ContentRetrievalService.byOrder(first, second));
  }

  public async renderedSections<Key extends TitledCollectionKey>(
    collectionName: Key
  ): Promise<RenderedSection[]> {
    const entries = await this.entries(collectionName);

    return Promise.all(
      entries.map(async entry => ({
        title: entry.data.title,
        Content: (await entry.render()).Content,
      }))
    );
  }

  public async data<Key extends OrderedCollectionKey>(
    collectionName: Key
  ): Promise<OrderedEntry<Key>["data"][]> {
    const entries = await this.entries(collectionName);

    return entries.map(({ data }) => data);
  }

  private static isPublished({ data }: AnyOrderedEntry): boolean {
    return !("draft" in data && data.draft);
  }

  private static byOrder(
    first: AnyOrderedEntry,
    second: AnyOrderedEntry
  ): number {
    return first.data.order - second.data.order;
  }
}

export const contentRetrievalService = new ContentRetrievalService();
