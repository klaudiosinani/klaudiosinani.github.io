import { DocumentLanguage } from "./DocumentLanguage";

export class DocumentLanguages {
    private readonly ENGLISH: string = "en";

    private readonly KNOWN: Readonly<Record<string, DocumentLanguage>> = {
        al: new DocumentLanguage("sq", "sq", "Shqip", "Albanian"),
        bg: new DocumentLanguage("bg", "bg", "Български", "Bulgarian"),
        de: new DocumentLanguage("de", "de", "Deutsch", "German"),
        ger: new DocumentLanguage("de", "de", "Deutsch", "German"),
        es: new DocumentLanguage("es", "es", "Español", "Spanish"),
        fr: new DocumentLanguage("fr", "fr", "Français", "French"),
        jp: new DocumentLanguage("ja", "ja", "日本語", "Japanese"),
        kr: new DocumentLanguage("ko", "ko", "한국어", "Korean"),
        pl: new DocumentLanguage("pl", "pl", "Polski", "Polish"),
        "pt-br": new DocumentLanguage("pt-BR", "pt-br", "Português (Brasil)", "Brazilian Portuguese"),
        ru: new DocumentLanguage("ru", "ru", "Русский", "Russian"),
        rus: new DocumentLanguage("ru", "ru", "Русский", "Russian"),
        tr: new DocumentLanguage("tr", "tr", "Türkçe", "Turkish"),
        zh: new DocumentLanguage("zh-CN", "zh-cn", "简体中文", "Simplified Chinese"),
        zh_cn: new DocumentLanguage("zh-CN", "zh-cn", "简体中文", "Simplified Chinese"),
    };

    public get english(): string {
        return this.ENGLISH;
    }

    public of(code: string): DocumentLanguage | null {
        return this.KNOWN[code.toLowerCase()] ?? null;
    }

    public isEnglish(code: string): boolean {
        return code.toLowerCase() === this.ENGLISH;
    }
}
