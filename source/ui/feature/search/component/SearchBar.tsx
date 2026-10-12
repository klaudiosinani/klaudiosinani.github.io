import type { JSX } from "react";
import SearchIcon from "@ui/component/icon/SearchIcon";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import SearchKindFilter from "./SearchKindFilter";
import SearchResultRow from "./SearchResultRow";
import { SiteSearchService } from "@app/feature/search/SiteSearchService";
import type { SearchItem } from "@app/feature/search/item/SearchItem";
import type { SearchItemKind } from "@app/feature/search/item/SearchItemKind";
import type { SearchResult } from "@app/feature/search/result/SearchResult";

import { SearchQueryValidator } from "@app/feature/search/query/SearchQueryValidator.ts";
import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";
import { SearchItemKinds } from "@app/feature/search/item/SearchItemKinds.ts";
import { SearchKindTally } from "@app/feature/search/result/SearchKindTally.ts";
import { SearchQueryUrlResolver } from "@app/feature/search/query/SearchQueryUrlResolver.ts";
import { SearchSubjectsFactory } from "@app/feature/search/item/SearchSubjectsFactory.ts";
import { SearchCursor } from "@app/feature/search/query/SearchCursor.ts";
import { SearchDestination } from "@app/feature/search/query/SearchDestination.ts";

const SEARCH_QUERY_VALIDATOR: SearchQueryValidator = new SearchQueryValidator();
const NUMBER_FORMATTER: NumberFormatter = new NumberFormatter();
const SEARCH_ITEM_KINDS: SearchItemKinds = new SearchItemKinds();
const SEARCH_KIND_TALLY: SearchKindTally = new SearchKindTally();
const SEARCH_QUERY_URL_RESOLVER: SearchQueryUrlResolver = new SearchQueryUrlResolver();
const SEARCH_SUBJECTS_FACTORY: SearchSubjectsFactory = new SearchSubjectsFactory();
const SEARCH_CURSOR: SearchCursor = new SearchCursor();
const SEARCH_DESTINATION: SearchDestination = new SearchDestination();

interface Props {
    readonly searchList: SearchItem[];
}

export default function SearchBar({ searchList }: Props): JSX.Element {
    const inputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const [inputVal, setInputVal] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
    const [kind, setKind] = useState<SearchItemKind | null>(null);
    const [at, setAt] = useState(0);

    const handleChange = (e: FormEvent<HTMLInputElement>): void => {
        setInputVal(e.currentTarget.value);
    };

    const index: SiteSearchService = useMemo(() => new SiteSearchService(searchList), [searchList]);

    const held: Record<SearchItemKind, number> = useMemo(
        () => SEARCH_KIND_TALLY.of(searchList.map((item: SearchItem) => ({ item, refIndex: 0 }))),
        [searchList]
    );
    const subjects: string[] = useMemo(() => SEARCH_SUBJECTS_FACTORY.create(searchList), [searchList]);

    useEffect(() => {
        const searchStr: string = SEARCH_QUERY_URL_RESOLVER.query(window.location.search);
        if (searchStr) setInputVal(searchStr);

        const caret: NodeJS.Timeout = setTimeout(() => {
            const input: HTMLInputElement | null = inputRef.current;
            if (!input) return;

            input.focus();
            input.selectionStart = input.selectionEnd = searchStr.length;
        }, 50);

        return (): void => clearTimeout(caret);
    }, []);

    useEffect(() => {
        setSearchResults(index.search(inputVal));
        setKind(null);
        setAt(0);

        history.replaceState(
            history.state,
            "",
            SEARCH_QUERY_URL_RESOLVER.resolve(window.location.pathname, window.location.search, inputVal)
        );
    }, [inputVal, index]);

    useEffect(() => {
        document
            .querySelector("[data-search-suggestions]")
            ?.classList.toggle("display-none", inputVal.trim().length > 0);
    }, [inputVal]);

    const found: SearchResult[] = searchResults ?? [];
    const tally: Record<SearchItemKind, number> = SEARCH_KIND_TALLY.of(found);
    const shown: SearchResult[] = SEARCH_KIND_TALLY.only(found, kind);

    const onKey: (event: KeyboardEvent<HTMLInputElement>) => void = useCallback(
        (event: KeyboardEvent<HTMLInputElement>): void => {
            if (shown.length === 0) return;

            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const step: number = event.key === "ArrowDown" ? 1 : -1;
                setAt((was: number) => SEARCH_CURSOR.moved(was, step, shown.length));

                return;
            }

            if (event.key === "Enter" && shown[at]) {
                SEARCH_DESTINATION.open(shown[at].item.href);
            }
        },
        [shown, at]
    );

    const clear = (): void => {
        setInputVal("");
        inputRef.current?.focus();
    };

    return (
        <>
            <div className="search-field">
                <SearchIcon className="search-field-mark" ariaHidden />
                <label className="sr-only" htmlFor="search-query">
                    Search this site
                </label>
                <input
                    id="search-query"
                    className="search-input"
                    placeholder="Search the software, the publications and the press"
                    type="text"
                    name="search"
                    value={inputVal}
                    onChange={handleChange}
                    onKeyDown={onKey}
                    autoComplete="off"
                    ref={inputRef}
                />
                {inputVal ? (
                    <button type="button" className="search-clear focus-outline" onClick={clear}>
                        Clear
                    </button>
                ) : (
                    <kbd className="key-cap search-field-key">/</kbd>
                )}
            </div>

            {!SEARCH_QUERY_VALIDATOR.isQueryable(inputVal) && (
                <div className="search-rest">
                    <p className="search-holds">
                        {SEARCH_ITEM_KINDS.ALL.filter((each: SearchItemKind) => held[each] > 0)
                            .map(
                                (each: SearchItemKind) =>
                                    `${NUMBER_FORMATTER.display(held[each])} ${SEARCH_ITEM_KINDS.plural(each).toLowerCase()}`
                            )
                            .join(", ")}
                        . Searched by name, by subject and by the language a project is written in.
                    </p>

                    {subjects.length > 0 && (
                        <div className="search-subjects">
                            <p className="band-label">Try a subject</p>
                            <ul className="search-subject-list">
                                {subjects.map((subject: string) => (
                                    <li key={subject}>
                                        <button
                                            type="button"
                                            className="chip search-subject focus-outline"
                                            onClick={() => setInputVal(subject)}
                                        >
                                            {subject}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {SEARCH_QUERY_VALIDATOR.isQueryable(inputVal) && found.length === 0 && (
                <div className="search-nothing">
                    <p className="search-nothing-line">Nothing matches &ldquo;{inputVal}&rdquo;.</p>
                    <p className="search-nothing-hint">
                        Try a shorter word, or one of the subjects: {subjects.join(", ")}.
                    </p>
                </div>
            )}

            {found.length > 0 && (
                <p className="search-count">
                    {found.length} {found.length === 1 ? "result" : "results"} for &ldquo;
                    {inputVal}&rdquo;
                </p>
            )}

            {found.length > 1 && (
                <SearchKindFilter
                    tally={tally}
                    total={found.length}
                    chosen={kind}
                    onChoose={(chosen: SearchItemKind | null) => {
                        setKind(chosen);
                        setAt(0);
                    }}
                />
            )}

            <ul className="search-results">
                {shown.map((result: SearchResult, index: number) => (
                    <SearchResultRow
                        key={`${result.refIndex}-${result.item.href}`}
                        result={result}
                        at={index === at}
                        onEnter={() => setAt(index)}
                    />
                ))}
            </ul>
        </>
    );
}
