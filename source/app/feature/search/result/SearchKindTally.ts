import type { SearchItem } from "../item/SearchItem";
import type { SearchItemKind } from "../item/SearchItemKind";
import type { SearchResult } from "./SearchResult";

export class SearchKindTally {
    public of(results: readonly SearchResult[]): Record<SearchItemKind, number> {
        const tally: Record<SearchItemKind, number> = {
            software: 0,
            publication: 0,
            press: 0,
        };

        for (const { item } of results) {
            tally[item.kind] += 1;
        }

        return tally;
    }

    public only(results: readonly SearchResult[], kind: SearchItemKind | null): SearchResult[] {
        if (!kind) {
            return [...results];
        }

        return results.filter(({ item }: { item: SearchItem }) => item.kind === kind);
    }
}
