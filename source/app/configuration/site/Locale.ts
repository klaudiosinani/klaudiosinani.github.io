export class Locale {
    private readonly language: string;
    private readonly languageTag: readonly string[];
    private readonly ogLocale: string;

    public constructor(language: string, languageTag: readonly string[], ogLocale: string) {
        this.language = language;
        this.languageTag = languageTag;
        this.ogLocale = ogLocale;
    }

    public getLanguage(): string {
        return this.language;
    }

    public getLanguageTag(): readonly string[] {
        return this.languageTag;
    }

    public getOgLocale(): string {
        return this.ogLocale;
    }
}
