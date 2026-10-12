import { NearestNameResolver } from "@app/util/text/NearestNameResolver.ts";

const NEAREST_NAME_RESOLVER: NearestNameResolver = new NearestNameResolver();

export class MissingPathSuggestion {
    private readonly NAMES: string = "#repository-names";
    private readonly SLOT: string = "[data-missing-suggestion]";
    private readonly SEPARATOR: string = "/";

    public mount(): void {
        const slot: HTMLElement | null = document.querySelector<HTMLElement>(this.SLOT);
        const stated: HTMLElement | null = document.querySelector<HTMLElement>(this.NAMES);

        if (!slot || !stated) {
            return;
        }

        const names: string[] = JSON.parse(stated.textContent ?? "[]") as string[];
        const asked: string = window.location.pathname.split(this.SEPARATOR)[1] ?? "";
        const nearest: string | null = NEAREST_NAME_RESOLVER.resolve(asked, names);

        if (!nearest) {
            return;
        }

        const link: HTMLAnchorElement = document.createElement("a");
        link.href = `/${nearest}/`;
        link.textContent = nearest;

        slot.append("The nearest page is ", link, ".");
        slot.hidden = false;
    }
}

export const MISSING_PATH_SUGGESTION: MissingPathSuggestion = new MissingPathSuggestion();
