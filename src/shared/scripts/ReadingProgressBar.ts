// The scroll listener uses a stable method reference so that re-mounting
// after a client-side navigation cannot stack duplicates
export class ReadingProgressBar {
  private static readonly CONTAINER_CLASS =
    "progress-container fixed top-0 z-10 h-1 w-full bg-skin-fill";
  private static readonly BAR_CLASS = "progress-bar h-1 w-0 bg-skin-accent";
  private static readonly BAR_ID = "myBar";

  public static mount(): void {
    if (document.getElementById(ReadingProgressBar.BAR_ID)) return;

    const container = document.createElement("div");
    container.className = ReadingProgressBar.CONTAINER_CLASS;

    const bar = document.createElement("div");
    bar.className = ReadingProgressBar.BAR_CLASS;
    bar.id = ReadingProgressBar.BAR_ID;

    container.appendChild(bar);
    document.body.appendChild(container);

    document.addEventListener("scroll", ReadingProgressBar.update);
  }

  private static update(): void {
    const bar = document.getElementById(ReadingProgressBar.BAR_ID);
    if (!bar) return;

    bar.style.width = `${ReadingProgressBar.scrolledPercentage()}%`;
  }

  private static scrolledPercentage(): number {
    const scrolled =
      document.body.scrollTop || document.documentElement.scrollTop;
    const scrollable =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    return scrollable === 0 ? 0 : (scrolled / scrollable) * 100;
  }
}
