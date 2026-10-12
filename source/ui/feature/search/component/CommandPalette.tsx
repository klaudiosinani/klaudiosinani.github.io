import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KEYBOARD_ROUTES } from "@app/configuration/route/KeyboardRoutes";
import type { KeyboardRoute } from "@app/configuration/route/KeyboardRoute";
import SearchIcon from "@ui/component/icon/SearchIcon";
import SearchKindMark from "./SearchKindMark";
import type { SearchItem } from "@app/feature/search/item/SearchItem";
import type { SearchResult } from "@app/feature/search/result/SearchResult";
import { SiteSearchService } from "@app/feature/search/SiteSearchService";

import { SearchQueryValidator } from "@app/feature/search/query/SearchQueryValidator.ts";
import { SearchCursor } from "@app/feature/search/query/SearchCursor.ts";
import { SearchDestination } from "@app/feature/search/query/SearchDestination.ts";

const SEARCH_QUERY_VALIDATOR: SearchQueryValidator = new SearchQueryValidator();
const SEARCH_CURSOR: SearchCursor = new SearchCursor();
const SEARCH_DESTINATION: SearchDestination = new SearchDestination();

const INDEX: string = "/search-index.json";

const SHOWN: number = 8;

const LIST: string = "palette-results";

interface Props {
    readonly opened: boolean;
}

export default function CommandPalette({ opened }: Props): JSX.Element | null {
    const [open, setOpen] = useState(opened);
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<SearchItem[] | null>(null);
    const [at, setAt] = useState(0);
    const field: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const panel: React.RefObject<HTMLDialogElement> = useRef<HTMLDialogElement>(null);

    const index: SiteSearchService | null = useMemo(() => (items ? new SiteSearchService(items) : null), [items]);

    const results: SearchItem[] = useMemo(() => {
        if (!index || !SEARCH_QUERY_VALIDATOR.isQueryable(query)) {
            return [];
        }

        return index
            .search(query)
            .slice(0, SHOWN)
            .map(({ item }: SearchResult) => item);
    }, [index, query]);

    const show: () => void = useCallback((): void => {
        setOpen(true);
        setQuery("");
        setAt(0);
    }, []);

    useEffect(() => {
        if (!open || items) {
            return;
        }

        let held: boolean = true;

        void fetch(INDEX)
            .then((answer: Response) => answer.json())
            .then((held2: SearchItem[]) => {
                if (held) {
                    setItems(held2);
                }
            })
            .catch(() => setItems([]));

        return (): void => {
            held = false;
        };
    }, [open, items]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const panelNode: HTMLDialogElement | null = panel.current;

        panelNode?.showModal();
        field.current?.focus();

        const onClose = (): void => setOpen(false);

        panelNode?.addEventListener("close", onClose);
        panelNode?.addEventListener("cancel", onClose);

        return (): void => {
            panelNode?.removeEventListener("close", onClose);
            panelNode?.removeEventListener("cancel", onClose);
        };
    }, [open]);

    useEffect(() => {
        const isTyping = (target: EventTarget | null): boolean =>
            target instanceof HTMLElement &&
            (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable);

        const onKey = (event: KeyboardEvent): void => {
            if (open && event.key === "Escape") {
                setOpen(false);

                return;
            }

            if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                show();

                return;
            }

            if (open || isTyping(event.target)) {
                return;
            }

            if (event.key === "/" || event.key === "?") {
                event.preventDefault();
                show();

                return;
            }
        };

        const onClick = (event: MouseEvent): void => {
            const control: Element | null =
                event.target instanceof Element ? event.target.closest("[data-open-search]") : null;

            if (!control || event.metaKey || event.ctrlKey || event.shiftKey) {
                return;
            }

            event.preventDefault();
            show();
        };

        document.documentElement.dataset.palette = "ready";

        const apple: boolean = /Mac|iPhone|iPad/.test(navigator.platform);

        document.querySelectorAll<HTMLElement>("[data-search-key]").forEach((hint: HTMLElement) => {
            hint.textContent = apple ? "⌘K" : "Ctrl K";
        });

        document.addEventListener("keydown", onKey);
        document.addEventListener("click", onClick, true);

        return (): void => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("click", onClick, true);
        };
    }, [open, show]);

    if (!open) {
        return null;
    }

    const move = (by: number): void => {
        setAt((held: number) => SEARCH_CURSOR.moved(held, by, results.length));
    };

    const onFieldKey = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            move(1);
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            move(-1);
        }

        if (event.key === "Enter" && results[at]) {
            event.preventDefault();
            SEARCH_DESTINATION.open(results[at].href);
        }
    };

    return (
        <dialog
            ref={panel}
            className="palette-ground"
            aria-label="Search this site"
            onClick={(event: React.MouseEvent<HTMLDialogElement>) => {
                if (event.target === event.currentTarget) {
                    setOpen(false);
                }
            }}
        >
            <div className="palette">
                <div className="palette-field">
                    <SearchIcon ariaHidden />
                    <input
                        ref={field}
                        className="palette-input"
                        type="text"
                        value={query}
                        placeholder="Search this site"
                        autoComplete="off"
                        aria-label="Search this site"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-controls={LIST}
                        aria-expanded={results.length > 0}
                        aria-activedescendant={results.length > 0 ? `${LIST}-${at}` : undefined}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setQuery(event.currentTarget.value);
                            setAt(0);
                        }}
                        onKeyDown={onFieldKey}
                    />
                    <kbd className="key-cap">Esc</kbd>
                </div>

                {results.length > 0 && (
                    <ul className="palette-results" id={LIST} role="listbox">
                        {results.map((item: SearchItem, index: number) => (
                            <li key={item.href} id={`${LIST}-${index}`} role="option" aria-selected={index === at}>
                                <a
                                    href={item.href}
                                    className={index === at ? "palette-result is-current" : "palette-result"}
                                    target={SEARCH_DESTINATION.isAway(item.href) ? "_blank" : undefined}
                                    rel={SEARCH_DESTINATION.isAway(item.href) ? "noopener noreferrer" : undefined}
                                    onMouseEnter={() => setAt(index)}
                                >
                                    <SearchKindMark kind={item.kind} />
                                    <span className="palette-title">{item.title}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                {SEARCH_QUERY_VALIDATOR.isQueryable(query) && results.length === 0 && (
                    <p className="palette-empty">No result matches &quot;{query}&quot;.</p>
                )}

                {!SEARCH_QUERY_VALIDATOR.isQueryable(query) && (
                    <div className="palette-help">
                        <p className="palette-help-label">The keys</p>
                        <ul className="palette-keys">
                            <li>
                                <kbd className="key-cap">⌘K</kbd> or <kbd className="key-cap">/</kbd>
                                <span>Open this panel</span>
                            </li>
                            {KEYBOARD_ROUTES.map((keyboardRoute: KeyboardRoute) => (
                                <li key={keyboardRoute.getHref()}>
                                    <kbd className="key-cap">g</kbd>
                                    <kbd className="key-cap">{keyboardRoute.getKey()}</kbd>
                                    <span>{keyboardRoute.getLabel()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </dialog>
    );
}
