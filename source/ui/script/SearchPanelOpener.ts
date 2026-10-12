export class SearchPanelOpener {
    private readonly TYPING_TAGS: readonly string[] = ["INPUT", "TEXTAREA", "SELECT"];
    private readonly onKeyDown: (keyboardEvent: KeyboardEvent) => void;
    private readonly onClickDown: (mouseEvent: MouseEvent) => void;
    private opening: boolean;

    public constructor() {
        this.opening = false;
        this.onKeyDown = (keyboardEvent: KeyboardEvent): void => this.readKey(keyboardEvent);
        this.onClickDown = (mouseEvent: MouseEvent): void => this.readClick(mouseEvent);
    }

    public mount(): void {
        document.documentElement.dataset.palette = "ready";
        this.nameTheKey();
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("click", this.onClickDown, true);
    }

    private readKey(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.key === "k" && (keyboardEvent.metaKey || keyboardEvent.ctrlKey)) {
            keyboardEvent.preventDefault();
            void this.open();

            return;
        }

        if (this.isTyping(keyboardEvent.target)) {
            return;
        }

        if (keyboardEvent.key === "/" || keyboardEvent.key === "?") {
            keyboardEvent.preventDefault();
            void this.open();
        }
    }

    private readClick(mouseEvent: MouseEvent): void {
        const control: Element | null =
            mouseEvent.target instanceof Element ? mouseEvent.target.closest("[data-open-search]") : null;

        if (!control || mouseEvent.metaKey || mouseEvent.ctrlKey || mouseEvent.shiftKey) {
            return;
        }

        mouseEvent.preventDefault();
        void this.open();
    }

    private async open(): Promise<void> {
        if (this.opening) {
            return;
        }

        this.opening = true;
        document.removeEventListener("keydown", this.onKeyDown);
        document.removeEventListener("click", this.onClickDown, true);

        const { SEARCH_PANEL_MOUNTER } = await import("@ui/feature/search/component/SearchPanelMounter");

        SEARCH_PANEL_MOUNTER.mount();
    }

    private isTyping(target: EventTarget | null): boolean {
        return target instanceof HTMLElement && (this.TYPING_TAGS.includes(target.tagName) || target.isContentEditable);
    }

    private nameTheKey(): void {
        const apple: boolean = /Mac|iPhone|iPad/.test(navigator.platform);

        document.querySelectorAll<HTMLElement>("[data-search-key]").forEach((hint: HTMLElement) => {
            hint.textContent = apple ? "⌘K" : "Ctrl K";
        });
    }
}

export const SEARCH_PANEL_OPENER: SearchPanelOpener = new SearchPanelOpener();
