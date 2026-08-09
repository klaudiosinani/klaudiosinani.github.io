export class NavigationMenu {
  private static readonly BUTTON = ".hamburger-menu";
  private static readonly ICON = ".menu-icon";
  private static readonly ITEMS = "#menu-items";
  private static readonly OPEN_LABEL = "Open Menu";
  private static readonly CLOSE_LABEL = "Close Menu";

  public static mount(): void {
    const button = document.querySelector(NavigationMenu.BUTTON);

    button?.addEventListener("click", () => NavigationMenu.toggle(button));
  }

  private static toggle(button: Element): void {
    const expanded = button.getAttribute("aria-expanded") === "true";

    document.querySelector(NavigationMenu.ICON)?.classList.toggle("is-active");
    button.setAttribute("aria-expanded", expanded ? "false" : "true");
    button.setAttribute(
      "aria-label",
      expanded ? NavigationMenu.OPEN_LABEL : NavigationMenu.CLOSE_LABEL
    );
    document
      .querySelector(NavigationMenu.ITEMS)
      ?.classList.toggle("display-none");
  }
}
