import { satteri } from "@astrojs/markdown-satteri";
import { MARKDOWN_STYLING } from "@app/configuration/site/MarkdownStyling";
import type { MarkdownRenderer as MarkdownPipeline, MarkdownRenderResult } from "astro/markdown";
import type { MarkdownPictureRestorer } from "./MarkdownPictureRestorer.ts";
import { RenderedMarkdown } from "./RenderedMarkdown.ts";

export class MarkdownRenderer {
    private readonly markdownPictureRestorer: MarkdownPictureRestorer;

    private pipeline: Promise<MarkdownPipeline> | undefined;

    public constructor(markdownPictureRestorer: MarkdownPictureRestorer) {
        this.markdownPictureRestorer = markdownPictureRestorer;
    }

    public async render(markdown: string): Promise<RenderedMarkdown> {
        const markdownPipeline: MarkdownPipeline = await this.resolvePipeline();
        const rendered: MarkdownRenderResult = await markdownPipeline.render(markdown);
        const html: string = this.markdownPictureRestorer.restore(rendered.code);

        return new RenderedMarkdown(html, rendered.metadata.headings);
    }

    private resolvePipeline(): Promise<MarkdownPipeline> {
        this.pipeline ??= satteri().createRenderer({ shikiConfig: MARKDOWN_STYLING });

        return this.pipeline;
    }
}
