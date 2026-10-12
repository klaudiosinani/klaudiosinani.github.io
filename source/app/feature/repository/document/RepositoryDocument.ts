import type { RepositoryDocumentKind } from "./RepositoryDocumentKind";
export class RepositoryDocument {
    private readonly path: string;
    private readonly slug: string;
    private readonly title: string;
    private readonly kind: RepositoryDocumentKind;
    private readonly language: string;
    private readonly languageName: string | null;

    public constructor(
        path: string,
        slug: string,
        title: string,
        kind: RepositoryDocumentKind,
        language: string,
        languageName: string | null
    ) {
        this.path = path;
        this.slug = slug;
        this.title = title;
        this.kind = kind;
        this.language = language;
        this.languageName = languageName;
    }

    public getPath(): string {
        return this.path;
    }
    public getSlug(): string {
        return this.slug;
    }
    public getTitle(): string {
        return this.title;
    }
    public getKind(): RepositoryDocumentKind {
        return this.kind;
    }
    public getLanguage(): string {
        return this.language;
    }
    public getLanguageName(): string | null {
        return this.languageName;
    }

    public isTranslation(): boolean {
        return this.kind === "translation";
    }
}
