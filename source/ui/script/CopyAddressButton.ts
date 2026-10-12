export class CopyAddressButton {
    private readonly BUTTON: string = "[data-copy-address]";
    private readonly COPIED: string = "Copied";
    private readonly REFUSED: string = "Copy it by hand";
    private readonly DELAY_MS: number = 700;

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
            const held: string = button.textContent ?? "";

            const say = (word: string): void => {
                button.textContent = word;

                window.setTimeout(() => {
                    button.textContent = held;
                }, this.DELAY_MS);
            };

            void navigator.clipboard
                .writeText(window.location.href)
                .then(() => say(this.COPIED))
                .catch(() => say(this.REFUSED));
        };

        const listening: AbortController = new AbortController();
        const { signal } = listening;

        this.listening = listening;

        buttons.forEach((button: HTMLButtonElement) => button.addEventListener("click", onClick, { signal }));
    }
}

export const COPY_ADDRESS_BUTTON: CopyAddressButton = new CopyAddressButton();
