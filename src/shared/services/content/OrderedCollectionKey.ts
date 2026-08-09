import type { CollectionEntry, CollectionKey } from "astro:content";

export type OrderedCollectionKey = {
  [Key in CollectionKey]: CollectionEntry<Key>["data"] extends { order: number }
    ? Key
    : never;
}[CollectionKey];
