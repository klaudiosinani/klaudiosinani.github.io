import type { SearchMatch } from "./SearchMatch";
import type { SearchItem } from "../item/SearchItem";

export interface SearchResult {
    readonly item: SearchItem;
    readonly refIndex: number;
    readonly matches?: readonly SearchMatch[];
}
