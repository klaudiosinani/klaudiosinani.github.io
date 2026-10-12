export class NavigationMenu {
    private readonly BUTTON: string = ".hamburger-menu";
    private readonly ICON: string = ".menu-icon";
    private readonly ITEMS: string = "#menu-items";
    private readonly HEADER: string = "header";
    private readonly HIDDEN: string = "display-none";
    private readonly OPEN_LABEL: string = "Open Menu";
    private readonly CLOSE_LABEL: string = "Close Menu";

    private bound: boolean = false;

    public mount(): void {
        const button: Element | null = document.querySelector(this.BUTTON);

        if (!button) {
            return;
        }

        button.addEventListener("click", () => this.toggle());

        if (this.bound) {
            return;
        }

        document.addEventListener("click", (mouseEvent: MouseEvent) => this.closeOnOutsideClick(mouseEvent));
        document.addEventListener("keydown", (keyboardEvent: KeyboardEvent) => this.closeOnEscape(keyboardEvent));
        this.bound = true;
    }

    private toggle(): void {
        this.isOpen() ? this.close() : this.open();
    }

    private open(): void {
        this.state(true);
    }

    private close(): void {
        this.state(false);
    }

    private state(open: boolean): void {
        const button: Element | null = document.querySelector(this.BUTTON);

        document.querySelector(this.ICON)?.classList.toggle("is-active", open);
        button?.setAttribute("aria-expanded", String(open));
        button?.setAttribute("aria-label", open ? this.CLOSE_LABEL : this.OPEN_LABEL);
        document.querySelector(this.ITEMS)?.classList.toggle(this.HIDDEN, !open);
    }

    private isOpen(): boolean {
        return document.querySelector(this.BUTTON)?.getAttribute("aria-expanded") === "true";
    }

    private closeOnOutsideClick(event: MouseEvent): void {
        const target: EventTarget | null = event.target;

        if (this.isOpen() && target instanceof Element && !target.closest(this.HEADER)) {
            this.close();
        }
    }

    private closeOnEscape(event: KeyboardEvent): void {
        if (event.key !== "Escape" || !this.isOpen()) {
            return;
        }

        this.close();
        document.querySelector<HTMLElement>(this.BUTTON)?.focus();
    }
}

export const NAVIGATION_MENU: NavigationMenu = new NavigationMenu();
