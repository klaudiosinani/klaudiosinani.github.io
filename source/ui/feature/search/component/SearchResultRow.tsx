import type { JSX } from "react";
import ArrowRightIcon from "@ui/component/icon/ArrowRightIcon";
import LanguageChip from "@ui/component/LanguageChip";
import SearchKindMark from "./SearchKindMark";
import type { SearchResult } from "@app/feature/search/result/SearchResult";
import type { SearchSegment } from "@app/feature/search/result/SearchSegment";

import { SearchHighlightFactory } from "@app/feature/search/result/SearchHighlightFactory.ts";

const SEARCH_HIGHLIGHT_FACTORY: SearchHighlightFactory = new SearchHighlightFactory();

interface Props {
    readonly result: SearchResult;
    readonly at: boolean;
    readonly onEnter: () => void;
}

export default function SearchResultRow({ result, at, onEnter }: Props): JSX.Element {
    const { item, matches } = result;
    const segments: SearchSegment[] = SEARCH_HIGHLIGHT_FACTORY.create(item.title, matches ?? []);

    return (
        <li className={at ? "panel search-result is-current" : "panel search-result"} onMouseEnter={onEnter}>
            <div className="panel-body search-body">
                <div className="search-head">
                    <SearchKindMark kind={item.kind} />
                    <h2 className="card-title">
                        <a href={item.href} className="card-link">
                            {segments.map((segment: SearchSegment, index: number) =>
                                segment.isMatched() ? (
                                    <mark key={index} className="search-hit">
                                        {segment.getText()}
                                    </mark>
                                ) : (
                                    <span key={index}>{segment.getText()}</span>
                                )
                            )}
                        </a>
                    </h2>
                    <ArrowRightIcon className="search-go" ariaHidden />
                </div>
                <p className="card-summary search-summary">{item.description}</p>
                {(item.language || item.meta.length > 0) && (
                    <div className="card-meta search-facts">
                        {item.language && <LanguageChip language={item.language} />}
                        {item.meta.map((fact: string) => (
                            <span key={fact}>{fact}</span>
                        ))}
                    </div>
                )}
            </div>
        </li>
    );
}
