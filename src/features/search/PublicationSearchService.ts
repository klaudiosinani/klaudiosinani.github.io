import Fuse from "fuse.js";
import type { SearchItem } from "./SearchItem";
import type { SearchResult } from "./SearchResult";

export class PublicationSearchService {
  private static readonly MINIMUM_QUERY_LENGTH = 2;
  private static readonly OPTIONS = {
    keys: ["title", "description"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.5,
  };

  private readonly fuse: Fuse<SearchItem>;

  public constructor(items: SearchItem[]) {
    this.fuse = new Fuse(items, PublicationSearchService.OPTIONS);
  }

  public search(query: string): SearchResult[] {
    if (query.length < PublicationSearchService.MINIMUM_QUERY_LENGTH) return [];

    return this.fuse.search(query) as SearchResult[];
  }

  public static isQueryable(query: string): boolean {
    return query.length >= PublicationSearchService.MINIMUM_QUERY_LENGTH;
  }
}
