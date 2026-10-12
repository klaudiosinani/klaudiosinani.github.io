export class SoftwareOrder {
    private readonly LIST: string = "[data-software-list]";
    private readonly CARD: string = "li";
    private readonly SORT: string = "[data-software-sort]";
    private readonly LANGUAGE: string = "[data-software-language]";
    private readonly ALL: string = "all";

    private listening?: AbortController;

    public mount(): void {
        this.listening?.abort();
        this.listening = undefined;

        const list: HTMLElement | null = document.querySelector<HTMLElement>(this.LIST);

        if (!list) {
            return;
        }

        const sorts: HTMLButtonElement[] = [...document.querySelectorAll<HTMLButtonElement>(this.SORT)];
        const languages: HTMLButtonElement[] = [...document.querySelectorAll<HTMLButtonElement>(this.LANGUAGE)];

        const onSort = (event: Event): void => {
            const button: HTMLButtonElement = event.currentTarget as HTMLButtonElement;

            this.press(sorts, button);
            this.order(list, button.dataset.softwareSort ?? "stars");
        };

        const onLanguage = (event: Event): void => {
            const button: HTMLButtonElement = event.currentTarget as HTMLButtonElement;

            this.press(languages, button);
            this.narrow(list, button.dataset.softwareLanguage ?? this.ALL);
        };

        const listening: AbortController = new AbortController();
        const { signal } = listening;

        this.listening = listening;

        sorts.forEach((button: HTMLButtonElement) => button.addEventListener("click", onSort, { signal }));
        languages.forEach((button: HTMLButtonElement) => button.addEventListener("click", onLanguage, { signal }));
    }

    private press(buttons: HTMLButtonElement[], pressed: HTMLButtonElement): void {
        buttons.forEach((button: HTMLButtonElement) =>
            button.setAttribute("aria-pressed", button === pressed ? "true" : "false")
        );
    }

    private order(list: HTMLElement, by: string): void {
        const cards: HTMLElement[] = [...list.querySelectorAll<HTMLElement>(this.CARD)];

        cards
            .sort((first: HTMLElement, second: HTMLElement) => this.compare(first, second, by))
            .forEach((card: HTMLElement) => list.append(card));
    }

    private compare(first: HTMLElement, second: HTMLElement, by: string): number {
        if (by === "name") {
            return (first.dataset.name ?? "").localeCompare(second.dataset.name ?? "");
        }

        if (by === "updated") {
            return Date.parse(second.dataset.updated ?? "") - Date.parse(first.dataset.updated ?? "");
        }

        return Number(second.dataset.stars ?? 0) - Number(first.dataset.stars ?? 0);
    }

    private narrow(list: HTMLElement, language: string): void {
        list.querySelectorAll<HTMLElement>(this.CARD).forEach((card: HTMLElement) => {
            card.hidden = language !== this.ALL && !(card.dataset.languages ?? "").split(" ").includes(language);
        });
    }
}

export const SOFTWARE_ORDER: SoftwareOrder = new SoftwareOrder();
