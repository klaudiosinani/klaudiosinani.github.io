import SearchIcon from "@components/icons/SearchIcon";
import { RoutePathResolver } from "@utils/routing/RoutePathResolver";
import { useEffect, useRef, useState, useMemo, type FormEvent } from "react";
import Card from "@features/publication/components/Card";
import { PublicationSearchService } from "@features/search/PublicationSearchService";
import { SearchQueryUrlResolver } from "@features/search/SearchQueryUrlResolver";
import type { SearchItem } from "@features/search/SearchItem";
import type { SearchResult } from "@features/search/SearchResult";

interface Props {
  readonly searchList: SearchItem[];
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const index = useMemo(
    () => new PublicationSearchService(searchList),
    [searchList]
  );

  useEffect(() => {
    const searchStr = SearchQueryUrlResolver.query(window.location.search);
    if (searchStr) setInputVal(searchStr);

    // Deferred; mid-navigation the input is not yet focusable
    const caret = setTimeout(() => {
      const input = inputRef.current;
      if (!input) return;

      input.focus();
      input.selectionStart = input.selectionEnd = searchStr.length;
    }, 50);

    return () => clearTimeout(caret);
  }, []);

  useEffect(() => {
    setSearchResults(index.search(inputVal));

    history.replaceState(
      history.state,
      "",
      SearchQueryUrlResolver.resolve(
        window.location.pathname,
        window.location.search,
        inputVal
      )
    );
  }, [inputVal, index]);

  return (
    <>
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
          <SearchIcon ariaHidden />
          <span className="sr-only">Search</span>
        </span>
        <input
          className="block w-full rounded border border-skin-fill/40 bg-skin-fill py-3 pl-10 pr-3 placeholder:italic focus:border-skin-accent focus:outline-none"
          placeholder="Search throughout publications"
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          ref={inputRef}
        />
      </label>

      {PublicationSearchService.isQueryable(inputVal) && (
        <div className="mt-8">
          Found {searchResults?.length}
          {searchResults?.length && searchResults?.length === 1
            ? " result"
            : " results"}{" "}
          for '{inputVal}'
        </div>
      )}

      <ul>
        {searchResults &&
          searchResults.map(({ item, refIndex }) => (
            <Card
              href={RoutePathResolver.resolvePublication(item.slug)}
              frontmatter={item.data}
              key={`${refIndex}-${item.slug}`}
            />
          ))}
      </ul>
    </>
  );
}
