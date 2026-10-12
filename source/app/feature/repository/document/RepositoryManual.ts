import type { MarkdownHeading } from "astro";

export class RepositoryManual {
    private readonly html: string;
    private readonly headings: MarkdownHeading[];
    private readonly install: string | null;
    private readonly related: string[];

    public constructor(html: string, headings: MarkdownHeading[], install: string | null, related: string[]) {
        this.html = html;
        this.headings = headings;
        this.install = install;
        this.related = related;
    }

    public getHtml(): string {
        return this.html;
    }
    public getHeadings(): MarkdownHeading[] {
        return this.headings;
    }
    public getInstall(): string | null {
        return this.install;
    }
    public getRelated(): string[] {
        return this.related;
    }
}
