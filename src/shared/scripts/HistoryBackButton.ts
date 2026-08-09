/** Goes back, or home when the page was opened directly */
export class HistoryBackButton {
  private static readonly SELECTOR = "#go-back";

  public static mount(): void {
    document
      .querySelector(HistoryBackButton.SELECTOR)
      ?.addEventListener("click", HistoryBackButton.goBack);
  }

  private static goBack(): void {
    if (history.length === 1) {
      window.location.href = "/";
      return;
    }

    history.back();
  }
}
