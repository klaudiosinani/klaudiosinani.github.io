export class InfoTooltips {
    private readonly TRIGGER: string = ".info-trigger";
    private readonly CONTAINER: string = ".info-tooltip";

    private bound: boolean = false;

    public mount(): void {
        const triggers: HTMLButtonElement[] = this.triggers();

        if (triggers.length === 0) {
            return;
        }

        triggers.forEach((trigger: HTMLButtonElement) => {
            trigger.addEventListener("click", () => this.toggle(trigger));
        });

        if (this.bound) {
            return;
        }

        document.addEventListener("click", (mouseEvent: MouseEvent) => this.closeOnOutsideClick(mouseEvent));
        document.addEventListener("keydown", (keyboardEvent: KeyboardEvent) => this.closeOnEscape(keyboardEvent));
        this.bound = true;
    }

    private toggle(trigger: HTMLButtonElement): void {
        const open: boolean = trigger.getAttribute("aria-expanded") === "true";

        trigger.setAttribute("aria-expanded", open ? "false" : "true");
    }

    private closeOnOutsideClick(event: MouseEvent): void {
        const target: EventTarget | null = event.target;
        const clicked: Element | null = target instanceof Element ? target.closest(this.CONTAINER) : null;

        this.triggers().forEach((trigger: HTMLButtonElement) => {
            if (trigger.closest(this.CONTAINER) !== clicked) {
                trigger.setAttribute("aria-expanded", "false");
            }
        });
    }

    private closeOnEscape(event: KeyboardEvent): void {
        if (event.key !== "Escape") {
            return;
        }

        const open: HTMLButtonElement | undefined = this.triggers().find(
            (trigger: HTMLButtonElement) => trigger.getAttribute("aria-expanded") === "true"
        );

        if (!open) {
            return;
        }

        open.setAttribute("aria-expanded", "false");
        open.focus();
    }

    private triggers(): HTMLButtonElement[] {
        return [...document.querySelectorAll<HTMLButtonElement>(this.TRIGGER)];
    }
}

export const INFO_TOOLTIPS: InfoTooltips = new InfoTooltips();
