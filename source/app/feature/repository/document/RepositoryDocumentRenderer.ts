import type { MarkdownRenderer } from "@app/infrastructure/render/markdown/MarkdownRenderer";
import type { RepositoryAddressResolver } from "@app/feature/repository/page/RepositoryAddressResolver";
import { RepositoryManual } from "./RepositoryManual";

import type { RenderedMarkdown } from "@app/infrastructure/render/markdown/RenderedMarkdown";

export class RepositoryDocumentRenderer {
    private readonly markdownRenderer: MarkdownRenderer;
    private readonly repositoryAddressResolver: RepositoryAddressResolver;

    public constructor(markdownRenderer: MarkdownRenderer, repositoryAddressResolver: RepositoryAddressResolver) {
        this.markdownRenderer = markdownRenderer;
        this.repositoryAddressResolver = repositoryAddressResolver;
    }
    public async render(markdown: string, repository: string): Promise<RepositoryManual | null> {
        const body: string = this.withoutContents(markdown);

        if (body.length === 0) {
            return null;
        }

        const rendered: RenderedMarkdown = await this.markdownRenderer.render(body);

        return new RepositoryManual(
            this.repositoryAddressResolver.resolve(rendered.getHtml(), repository),
            rendered.getHeadings(),
            null,
            []
        );
    }

    private withoutContents(markdown: string): string {
        return markdown.replace(/^##\s+(?:table of )?contents\s*$[\s\S]*?(?=^##\s)/gim, "").trim();
    }
}
