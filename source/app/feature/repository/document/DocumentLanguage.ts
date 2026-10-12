export class DocumentLanguage {
    private readonly tag: string;
    private readonly slug: string;
    private readonly name: string;
    private readonly english: string;

    public constructor(tag: string, slug: string, name: string, english: string) {
        this.tag = tag;
        this.slug = slug;
        this.name = name;
        this.english = english;
    }

    public getTag(): string {
        return this.tag;
    }
    public getSlug(): string {
        return this.slug;
    }
    public getName(): string {
        return this.name;
    }
    public getEnglish(): string {
        return this.english;
    }
}
