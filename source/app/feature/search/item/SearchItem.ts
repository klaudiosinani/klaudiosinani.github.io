import type { SearchItemKind } from "./SearchItemKind";

export interface SearchItem {
    readonly kind: SearchItemKind;
    readonly title: string;
    readonly description: string;
    readonly href: string;
    readonly keywords: string[];
    readonly meta: string[];
    readonly language: string | null;
}
