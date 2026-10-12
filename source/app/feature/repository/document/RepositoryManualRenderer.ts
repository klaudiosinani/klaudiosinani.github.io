import type { InstallCommandResolver } from "@app/feature/repository/package/InstallCommandResolver";
import type { MarkdownRenderer } from "@app/infrastructure/render/markdown/MarkdownRenderer";
import type { RepositoryAddressResolver } from "@app/feature/repository/page/RepositoryAddressResolver";
import type { StatedRelatedProjectsResolver } from "@app/feature/repository/profile/StatedRelatedProjectsResolver";
import { RepositoryManual } from "./RepositoryManual";

import type { RenderedMarkdown } from "@app/infrastructure/render/markdown/RenderedMarkdown";
export class RepositoryManualRenderer {
    private readonly installCommandResolver: InstallCommandResolver;
    private readonly markdownRenderer: MarkdownRenderer;
    private readonly repositoryAddressResolver: RepositoryAddressResolver;
    private readonly statedRelatedProjectsResolver: StatedRelatedProjectsResolver;

    public constructor(
        installCommandResolver: InstallCommandResolver,
        markdownRenderer: MarkdownRenderer,
        repositoryAddressResolver: RepositoryAddressResolver,
        statedRelatedProjectsResolver: StatedRelatedProjectsResolver
    ) {
        this.installCommandResolver = installCommandResolver;
        this.markdownRenderer = markdownRenderer;
        this.repositoryAddressResolver = repositoryAddressResolver;
        this.statedRelatedProjectsResolver = statedRelatedProjectsResolver;
    }
    public async render(markdown: string, repository: string): Promise<RepositoryManual | null> {
        const body: string = this.fromFirstSection(markdown);
        const trimmed: string = this.withoutRelated(this.withoutContents(body));

        if (trimmed.length === 0) {
            return null;
        }

        const rendered: RenderedMarkdown = await this.markdownRenderer.render(trimmed);

        return new RepositoryManual(
            this.repositoryAddressResolver.resolve(rendered.getHtml(), repository),
            rendered.getHeadings(),
            this.installCommandResolver.resolve(body),
            this.statedRelatedProjectsResolver.resolve(markdown, repository)
        );
    }

    private fromFirstSection(markdown: string): string {
        const opening: number = markdown.search(/^##\s/m);

        return (opening === -1 ? markdown : markdown.slice(opening)).trim();
    }

    private withoutContents(markdown: string): string {
        return markdown.replace(/^##\s+(?:table of )?contents\s*$[\s\S]*?(?=^##\s)/gim, "").trim();
    }

    private withoutRelated(markdown: string): string {
        return markdown.replace(/^##\s+related\b[^\n]*$[\s\S]*?(?=^##\s)/gim, "").trim();
    }
}
