import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";
import type { SearchItem } from "./item/SearchItem";
import type { SearchResult } from "./result/SearchResult";

export class SiteSearchService {
    private readonly MINIMUM_QUERY_LENGTH: number = 2;
    private readonly OPTIONS: IFuseOptions<SearchItem> = {
        keys: [
            { name: "title", weight: 0.6 },
            { name: "keywords", weight: 0.25 },
            { name: "description", weight: 0.15 },
        ],
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.5,
    };

    private readonly fuse: Fuse<SearchItem>;

    public constructor(items: SearchItem[]) {
        this.fuse = new Fuse(items, this.OPTIONS);
    }

    public search(query: string): SearchResult[] {
        if (query.length < this.MINIMUM_QUERY_LENGTH) return [];

        return this.fuse.search(query) as SearchResult[];
    }
}
