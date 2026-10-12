export class PageTitleFormatter {
    private readonly LIMIT: number = 60;
    private readonly SEPARATOR: string = " - ";

    public format(title: string, site: string): string {
        if (title.includes(site)) {
            return title;
        }

        const full: string = `${title}${this.SEPARATOR}${site}`;

        return full.length <= this.LIMIT ? full : title;
    }
}
