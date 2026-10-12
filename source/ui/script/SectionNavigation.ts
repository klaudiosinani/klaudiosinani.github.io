export class SectionNavigation {
    private readonly RAILS: string = "[data-section-rail]";
    private readonly CURRENT: string = "is-current";

    private readonly READING_LINE: number = 0.25;

    private readonly FOOT_MARGIN: number = 4;

    private listening?: AbortController;

    public mount(): void {
        this.listening?.abort();
        this.listening = undefined;

        const watched: {
            links: Map<string, HTMLAnchorElement>;
            sections: HTMLElement[];
        }[] = [...document.querySelectorAll<HTMLElement>(this.RAILS)]
            .map((rail: HTMLElement) => this.railOf(rail))
            .filter(
                ({ sections }: { links: Map<string, HTMLAnchorElement>; sections: HTMLElement[] }) =>
                    sections.length > 0
            );

        if (watched.length === 0) {
            return;
        }

        let waiting: boolean = false;

        const follow = (): void => {
            if (waiting) {
                return;
            }

            waiting = true;
            requestAnimationFrame(() => {
                waiting = false;
                watched.forEach((rail: { links: Map<string, HTMLAnchorElement>; sections: HTMLElement[] }) =>
                    this.mark(rail.sections, rail.links)
                );
            });
        };

        const listening: AbortController = new AbortController();
        const { signal } = listening;

        this.listening = listening;

        document.addEventListener("scroll", follow, { passive: true, signal });
        window.addEventListener("resize", follow, { passive: true, signal });

        watched.forEach((rail: { links: Map<string, HTMLAnchorElement>; sections: HTMLElement[] }) =>
            this.mark(rail.sections, rail.links)
        );
    }

    private atTheFoot(): boolean {
        const page: HTMLElement = document.documentElement;

        return window.scrollY + window.innerHeight >= page.scrollHeight - this.FOOT_MARGIN;
    }

    private railOf(rail: HTMLElement): {
        links: Map<string, HTMLAnchorElement>;
        sections: HTMLElement[];
    } {
        const links: Map<string, HTMLAnchorElement> = new Map<string, HTMLAnchorElement>(
            [...rail.querySelectorAll<HTMLAnchorElement>("a[href^='#']")].map((link: HTMLAnchorElement) => [
                decodeURIComponent(link.hash.slice(1)),
                link,
            ])
        );

        return {
            links,
            sections: [...links.keys()]
                .map((id: string) => document.getElementById(id))
                .filter((section: HTMLElement | null): section is HTMLElement => section !== null),
        };
    }

    private mark(sections: HTMLElement[], links: Map<string, HTMLAnchorElement>): void {
        const line: number = window.innerHeight * this.READING_LINE;
        const reached: HTMLElement = this.atTheFoot()
            ? sections[sections.length - 1]
            : sections.reduce((current: HTMLElement, section: HTMLElement) =>
                  section.getBoundingClientRect().top <= line ? section : current
              );

        links.forEach((link: HTMLAnchorElement) => link.classList.remove(this.CURRENT));
        links.get(reached.id)?.classList.add(this.CURRENT);
    }
}

export const SECTION_NAVIGATION: SectionNavigation = new SectionNavigation();
