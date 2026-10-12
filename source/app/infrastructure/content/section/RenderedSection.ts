import type { RenderedContent } from "./RenderedContent.ts";

export class RenderedSection {
    private readonly title: string;
    private readonly content: RenderedContent;
    private readonly href: string | undefined;

    public constructor(title: string, content: RenderedContent, href: string | undefined) {
        this.title = title;
        this.content = content;
        this.href = href;
    }

    public getTitle(): string {
        return this.title;
    }

    public getContent(): RenderedContent {
        return this.content;
    }

    public getHref(): string | undefined {
        return this.href;
    }
}
