import type { CollectionEntry } from "astro:content";

export interface SearchItem {
  readonly title: string;
  readonly description: string;
  readonly data: CollectionEntry<"blog">["data"];
  readonly slug: string;
}
