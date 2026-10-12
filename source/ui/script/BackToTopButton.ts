export class BackToTopButton {
    private readonly SELECTOR: string = "#back-to-top";

    public mount(): void {
        document.querySelector(this.SELECTOR)?.addEventListener("click", () => this.scrollToTop());
    }

    private scrollToTop(): void {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

export const BACK_TO_TOP_BUTTON: BackToTopButton = new BackToTopButton();
