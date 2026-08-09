import type { CollectionEntry } from "astro:content";
import type { OrderedCollectionKey } from "./OrderedCollectionKey";

type AnyOrderedEntry = CollectionEntry<OrderedCollectionKey>;

export interface RenderedSection {
  readonly title: string;
  readonly Content: Awaited<ReturnType<AnyOrderedEntry["render"]>>["Content"];
}
