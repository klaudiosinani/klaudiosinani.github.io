/** Appends a `#` permalink to every heading, revealed on hover */
export class HeadingAnchors {
  private static readonly HEADINGS = "h2, h3, h4, h5, h6";
  private static readonly LINK_CLASS =
    "heading-link ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100";
  private static readonly MARKER = "heading-link";

  public static mount(): void {
    for (const heading of document.querySelectorAll<HTMLElement>(
      HeadingAnchors.HEADINGS
    )) {
      if (heading.querySelector(`.${HeadingAnchors.MARKER}`)) continue;

      heading.classList.add("group");
      heading.appendChild(HeadingAnchors.linkTo(heading.id));
    }
  }

  private static linkTo(id: string): HTMLAnchorElement {
    const link = document.createElement("a");
    link.className = HeadingAnchors.LINK_CLASS;
    link.href = `#${id}`;

    const hash = document.createElement("span");
    hash.ariaHidden = "true";
    hash.innerText = "#";
    link.appendChild(hash);

    return link;
  }
}
