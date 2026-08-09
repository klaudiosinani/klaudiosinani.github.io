export class CodeCopyButtons {
  private static readonly LABEL = "Copy";
  private static readonly COPIED_LABEL = "Copied";
  private static readonly RESET_DELAY_MS = 700;
  private static readonly MARKER = "copy-code";
  private static readonly BUTTON_CLASS =
    "copy-code absolute right-3 -top-3 rounded bg-skin-card px-2 py-1 text-xs leading-4 text-skin-base font-medium";

  public static mount(): void {
    for (const block of document.querySelectorAll<HTMLPreElement>("pre")) {
      if (block.querySelector(`.${CodeCopyButtons.MARKER}`)) continue;

      CodeCopyButtons.attachTo(block);
    }
  }

  private static attachTo(block: HTMLPreElement): void {
    const button = document.createElement("button");
    button.className = CodeCopyButtons.BUTTON_CLASS;
    button.innerHTML = CodeCopyButtons.LABEL;

    block.setAttribute("tabindex", "0");
    block.appendChild(button);

    // The button is absolutely positioned, so the block needs a relative parent
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    block.parentNode?.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    button.addEventListener("click", () => {
      void CodeCopyButtons.copy(block, button);
    });
  }

  private static async copy(
    block: HTMLPreElement,
    button: HTMLButtonElement
  ): Promise<void> {
    await navigator.clipboard.writeText(
      block.querySelector("code")?.innerText ?? ""
    );

    button.innerText = CodeCopyButtons.COPIED_LABEL;
    setTimeout(() => {
      button.innerText = CodeCopyButtons.LABEL;
    }, CodeCopyButtons.RESET_DELAY_MS);
  }
}
