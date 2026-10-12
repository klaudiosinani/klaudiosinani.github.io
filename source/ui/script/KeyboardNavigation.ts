import { KEYBOARD_ROUTES } from "@app/configuration/route/KeyboardRoutes";
import type { KeyboardRoute } from "@app/configuration/route/KeyboardRoute";

export class KeyboardNavigation {
    private readonly WINDOW: number = 1000;

    private pending: string = "";
    private forgetting: number = 0;

    private bound: boolean = false;

    public mount(): void {
        if (this.bound) {
            return;
        }

        document.addEventListener("keydown", (keyboardEvent: KeyboardEvent) => this.onKey(keyboardEvent));
        this.bound = true;
    }

    private onKey(event: KeyboardEvent): void {
        if (this.isBusy(event)) {
            return;
        }

        if (event.key === "g") {
            this.remember();

            return;
        }

        if (this.pending !== "g") {
            return;
        }

        this.pending = "";

        const wanted: KeyboardRoute | undefined = KEYBOARD_ROUTES.find(
            (keyboardRoute: KeyboardRoute) => keyboardRoute.getKey() === event.key
        );

        if (wanted) {
            event.preventDefault();
            window.location.href = wanted.getHref();
        }
    }

    private isBusy(event: KeyboardEvent): boolean {
        const target: EventTarget | null = event.target;

        return (
            event.metaKey ||
            event.ctrlKey ||
            event.altKey ||
            document.querySelector("dialog[open]") !== null ||
            (target instanceof HTMLElement &&
                (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable))
        );
    }

    private remember(): void {
        this.pending = "g";
        window.clearTimeout(this.forgetting);
        this.forgetting = window.setTimeout(() => {
            this.pending = "";
        }, this.WINDOW);
    }
}

export const KEYBOARD_NAVIGATION: KeyboardNavigation = new KeyboardNavigation();
