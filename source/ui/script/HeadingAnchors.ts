export class HeadingAnchors {
    private readonly HEADINGS: string = "h2, h3, h4, h5, h6";
    private readonly LINK_CLASS: string = "heading-link ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100";
    private readonly MARKER: string = "heading-link";

    public mount(): void {
        for (const heading of document.querySelectorAll<HTMLElement>(this.HEADINGS)) {
            if (heading.querySelector(`.${this.MARKER}`)) continue;

            heading.classList.add("group");
            heading.appendChild(this.linkTo(heading.id));
        }
    }

    private linkTo(id: string): HTMLAnchorElement {
        const link: HTMLAnchorElement = document.createElement("a");
        link.className = this.LINK_CLASS;
        link.href = `#${id}`;

        const hash: HTMLSpanElement = document.createElement("span");
        hash.ariaHidden = "true";
        hash.innerText = "#";
        link.appendChild(hash);

        return link;
    }
}

export const HEADING_ANCHORS: HeadingAnchors = new HeadingAnchors();
