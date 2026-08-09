export class BackToTopButton {
  private static readonly SELECTOR = "#back-to-top";

  public static mount(): void {
    document
      .querySelector(BackToTopButton.SELECTOR)
      ?.addEventListener("click", BackToTopButton.scrollToTop);
  }

  private static scrollToTop(): void {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // everyone else
  }
}
