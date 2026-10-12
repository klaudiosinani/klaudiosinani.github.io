export class ActivityFilter {
    private readonly BUTTON: string = "[data-activity-filter]";
    private readonly ENTRY: string = ".timeline-entry";
    private readonly MONTH: string = "[data-activity-month]";
    private readonly ALL: string = "all";

    private listening?: AbortController;

    public mount(): void {
        this.listening?.abort();
        this.listening = undefined;

        const buttons: HTMLButtonElement[] = [...document.querySelectorAll<HTMLButtonElement>(this.BUTTON)];

        if (buttons.length === 0) {
            return;
        }

        const onClick = (event: Event): void => {
            const button: HTMLButtonElement = event.currentTarget as HTMLButtonElement;

            this.apply(buttons, button.dataset.activityFilter ?? this.ALL);
        };

        const listening: AbortController = new AbortController();
        const { signal } = listening;

        this.listening = listening;

        buttons.forEach((button: HTMLButtonElement) => button.addEventListener("click", onClick, { signal }));
    }

    private apply(buttons: HTMLButtonElement[], wanted: string): void {
        buttons.forEach((button: HTMLButtonElement) =>
            button.setAttribute("aria-pressed", button.dataset.activityFilter === wanted ? "true" : "false")
        );

        document.querySelectorAll<HTMLElement>(this.ENTRY).forEach((entry: HTMLElement) => {
            entry.hidden = wanted !== this.ALL && entry.dataset.kind !== wanted;
        });

        document.querySelectorAll<HTMLElement>(this.MONTH).forEach((month: HTMLElement) => {
            month.hidden = !month.querySelector(`${this.ENTRY}:not([hidden])`);
        });
    }
}

export const ACTIVITY_FILTER: ActivityFilter = new ActivityFilter();
