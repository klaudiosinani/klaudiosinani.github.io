export class HistoryBackButton {
    private readonly SELECTOR: string = "#go-back";

    public mount(): void {
        document.querySelector(this.SELECTOR)?.addEventListener("click", () => this.goBack());
    }

    private goBack(): void {
        if (history.length === 1) {
            window.location.href = "/";
            return;
        }

        history.back();
    }
}

export const HISTORY_BACK_BUTTON: HistoryBackButton = new HistoryBackButton();
