export class CodeCopyButtons {
    private readonly LABEL: string = "Copy";
    private readonly COPIED_LABEL: string = "Copied";
    private readonly RESET_DELAY_MS: number = 700;
    private readonly MARKER: string = "copy-code";
    private readonly BUTTON_CLASS: string =
        "copy-code absolute right-2 top-2 rounded-sm border border-skin-line bg-skin-card px-2 py-1 text-xs leading-4 text-skin-base font-medium";
    private readonly HOST_CLASS: string = "copy-host";

    public mount(): void {
        for (const block of document.querySelectorAll<HTMLPreElement>("pre")) {
            if (block.querySelector(`.${this.MARKER}`)) continue;

            this.attachTo(block);
        }
    }

    private attachTo(block: HTMLPreElement): void {
        const button: HTMLButtonElement = document.createElement("button");
        button.className = this.BUTTON_CLASS;
        button.innerHTML = this.LABEL;
        button.type = "button";

        block.setAttribute("tabindex", "0");
        block.appendChild(button);

        const wrapper: HTMLDivElement = document.createElement("div");
        wrapper.className = this.HOST_CLASS;
        block.parentNode?.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        button.addEventListener("click", () => {
            void this.copy(block, button);
        });
    }

    private async copy(block: HTMLPreElement, button: HTMLButtonElement): Promise<void> {
        await navigator.clipboard.writeText(block.querySelector("code")?.innerText ?? "");

        button.innerText = this.COPIED_LABEL;
        setTimeout(() => {
            button.innerText = this.LABEL;
        }, this.RESET_DELAY_MS);
    }
}

export const CODE_COPY_BUTTONS: CodeCopyButtons = new CodeCopyButtons();
