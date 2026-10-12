import { LOCALE } from "@app/configuration/site/SiteLocale";

export class ListFormatter {
    private readonly CONJUNCTION: Intl.ListFormat = new Intl.ListFormat([...LOCALE.getLanguageTag()], {
        style: "long",
        type: "conjunction",
    });

    public format(entries: readonly string[]): string {
        return this.CONJUNCTION.format(entries);
    }
}
