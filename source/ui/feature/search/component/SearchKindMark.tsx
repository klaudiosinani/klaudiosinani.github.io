import type { JSX } from "react";
import DocumentIcon from "@ui/component/icon/DocumentIcon";
import type { IconComponent } from "@ui/icon/IconComponent";
import MegaphoneIcon from "@ui/component/icon/MegaphoneIcon";
import RepositoryIcon from "@ui/component/icon/RepositoryIcon";
import type { SearchItemKind } from "@app/feature/search/item/SearchItemKind";

import { SearchItemKinds } from "@app/feature/search/item/SearchItemKinds.ts";

const SEARCH_ITEM_KINDS: SearchItemKinds = new SearchItemKinds();
interface Props {
    readonly kind: SearchItemKind;
}

const MARKS: Readonly<Record<SearchItemKind, IconComponent>> = {
    software: RepositoryIcon,
    publication: DocumentIcon,
    press: MegaphoneIcon,
};

export default function SearchKindMark({ kind }: Props): JSX.Element {
    const Mark: IconComponent = MARKS[kind];

    return (
        <span className="chip search-kind" data-kind={kind}>
            <Mark className="search-kind-icon" ariaHidden />
            {SEARCH_ITEM_KINDS.name(kind)}
        </span>
    );
}
