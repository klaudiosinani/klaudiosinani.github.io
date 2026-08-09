import type { SearchItem } from "./SearchItem";

export interface SearchResult {
  readonly item: SearchItem;
  readonly refIndex: number;
}
