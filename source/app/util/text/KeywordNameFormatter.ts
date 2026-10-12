import { KEYWORD_NAMES } from "@app/configuration/site/KeywordNames";

export class KeywordNameFormatter {
    private readonly SEPARATOR: RegExp = /-/g;

    public format(keyword: string): string {
        const named: string | undefined = KEYWORD_NAMES[keyword];

        if (named) {
            return named;
        }

        const words: string = keyword.replace(this.SEPARATOR, " ");

        return words.charAt(0).toUpperCase() + words.slice(1);
    }
}
