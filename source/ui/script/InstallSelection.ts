export class InstallSelection {
    private readonly BLOCK: string = "[data-install]";
    private readonly TAB: string = "[data-install-tab]";
    private readonly COMMAND: string = "[data-install-command]";
    private readonly KEY: string = "install-manager";

    private listening?: AbortController;

    public mount(): void {
        this.listening?.abort();
        this.listening = undefined;

        const blocks: HTMLElement[] = [...document.querySelectorAll<HTMLElement>(this.BLOCK)];

        if (blocks.length === 0) {
            return;
        }

        const onClick = (event: Event): void => {
            const tab: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
            const manager: string = tab.dataset.installTab ?? "";

            this.remember(manager);
            blocks.forEach((block: HTMLElement) => this.select(block, manager));
        };

        const tabs: HTMLButtonElement[] = blocks.flatMap((block: HTMLElement) => [
            ...block.querySelectorAll<HTMLButtonElement>(this.TAB),
        ]);

        const listening: AbortController = new AbortController();
        const { signal } = listening;

        this.listening = listening;

        tabs.forEach((tab: HTMLButtonElement) => tab.addEventListener("click", onClick, { signal }));

        const held: string | null = this.held();

        if (held) {
            blocks.forEach((block: HTMLElement) => this.select(block, held));
        }
    }

    private select(block: HTMLElement, manager: string): void {
        const wanted: HTMLElement | null = block.querySelector<HTMLElement>(`[data-install-command="${manager}"]`);

        if (!wanted) {
            return;
        }

        block.querySelectorAll<HTMLElement>(this.COMMAND).forEach((command: HTMLElement) => {
            command.hidden = command !== wanted;
        });

        block
            .querySelectorAll<HTMLButtonElement>(this.TAB)
            .forEach((tab: HTMLButtonElement) =>
                tab.setAttribute("aria-pressed", tab.dataset.installTab === manager ? "true" : "false")
            );
    }

    private remember(manager: string): void {
        try {
            window.localStorage.setItem(this.KEY, manager);
        } catch {
            return;
        }
    }

    private held(): string | null {
        try {
            return window.localStorage.getItem(this.KEY);
        } catch {
            return null;
        }
    }
}

export const INSTALL_SELECTION: InstallSelection = new InstallSelection();
