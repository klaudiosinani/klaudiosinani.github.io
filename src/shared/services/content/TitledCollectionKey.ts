import type { CollectionEntry, CollectionKey } from "astro:content";

export type TitledCollectionKey = {
  [Key in CollectionKey]: CollectionEntry<Key>["data"] extends {
    order: number;
    title: string;
  }
    ? Key
    : never;
}[CollectionKey];
