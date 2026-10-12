import type { MarkdownHeading } from "astro";

export class RenderedMarkdown {
    private readonly html: string;
    private readonly headings: MarkdownHeading[];

    public constructor(html: string, headings: MarkdownHeading[]) {
        this.html = html;
        this.headings = headings;
    }

    public getHtml(): string {
        return this.html;
    }

    public getHeadings(): MarkdownHeading[] {
        return this.headings;
    }
}
