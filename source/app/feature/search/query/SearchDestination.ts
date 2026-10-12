export class SearchDestination {
    private readonly AWAY: RegExp = /^https?:\/\//;

    public isAway(href: string): boolean {
        return this.AWAY.test(href);
    }

    public open(href: string): void {
        if (this.isAway(href)) {
            window.open(href, "_blank", "noopener,noreferrer");

            return;
        }

        window.location.href = href;
    }
}
