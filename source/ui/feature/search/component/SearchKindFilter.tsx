import type { JSX } from "react";
import type { SearchItemKind } from "@app/feature/search/item/SearchItemKind";

import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";
import { SearchItemKinds } from "@app/feature/search/item/SearchItemKinds.ts";

const NUMBER_FORMATTER: NumberFormatter = new NumberFormatter();
const SEARCH_ITEM_KINDS: SearchItemKinds = new SearchItemKinds();
interface Props {
    readonly tally: Record<SearchItemKind, number>;
    readonly total: number;
    readonly chosen: SearchItemKind | null;
    readonly onChoose: (kind: SearchItemKind | null) => void;
}

export default function SearchKindFilter({ tally, total, chosen, onChoose }: Props): JSX.Element {
    const offered: SearchItemKind[] = SEARCH_ITEM_KINDS.ALL.filter((kind: SearchItemKind) => tally[kind] > 0);

    return (
        <div className="search-kinds filter" role="group" aria-label="Kind of result">
            <button
                type="button"
                className="filter-option focus-outline"
                aria-pressed={chosen === null}
                onClick={() => onChoose(null)}
            >
                All {NUMBER_FORMATTER.display(total)}
            </button>
            {offered.map((kind: SearchItemKind) => (
                <button
                    key={kind}
                    type="button"
                    className="filter-option focus-outline"
                    aria-pressed={chosen === kind}
                    onClick={() => onChoose(kind)}
                >
                    {SEARCH_ITEM_KINDS.plural(kind)} {NUMBER_FORMATTER.display(tally[kind])}
                </button>
            ))}
        </div>
    );
}
