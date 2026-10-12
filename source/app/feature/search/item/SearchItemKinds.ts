import type { SearchItemKind } from "./SearchItemKind";

export class SearchItemKinds {
    public readonly ALL: readonly SearchItemKind[] = ["software", "publication", "press"];

    private readonly NAMES: Readonly<Record<SearchItemKind, string>> = {
        software: "Software",
        publication: "Publication",
        press: "Press",
    };

    private readonly PLURALS: Readonly<Record<SearchItemKind, string>> = {
        software: "Software",
        publication: "Publications",
        press: "Press",
    };

    public name(kind: SearchItemKind): string {
        return this.NAMES[kind];
    }

    public plural(kind: SearchItemKind): string {
        return this.PLURALS[kind];
    }
}
