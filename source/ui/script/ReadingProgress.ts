export class ReadingProgress {
    private readonly BAR: string = "#reading-progress";
    private readonly ARTICLE: string = "#article";

    private listening?: AbortController;

    public mount(): void {
        this.listening?.abort();
        this.listening = undefined;

        const bar: HTMLElement | null = document.querySelector<HTMLElement>(this.BAR);
        const article: HTMLElement | null = document.querySelector<HTMLElement>(this.ARTICLE);

        if (!bar || !article) {
            return;
        }

        const listening: AbortController = new AbortController();
        const { signal } = listening;
        const update = (): void => {
            bar.style.transform = `scaleX(${this.read(article)})`;
        };

        this.listening = listening;

        update();
        document.addEventListener("scroll", update, { passive: true, signal });
        window.addEventListener("resize", update, { passive: true, signal });
    }

    private read(article: HTMLElement): number {
        const start: number = article.offsetTop;
        const distance: number = article.offsetHeight - window.innerHeight;

        if (distance <= 0) {
            return 1;
        }

        return Math.min(1, Math.max(0, (window.scrollY - start) / distance));
    }
}

export const READING_PROGRESS: ReadingProgress = new ReadingProgress();
