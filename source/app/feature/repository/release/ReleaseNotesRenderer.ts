import type { MarkdownRenderer } from "@app/infrastructure/render/markdown/MarkdownRenderer";
import type { RepositoryAddressResolver } from "@app/feature/repository/page/RepositoryAddressResolver";

export class ReleaseNotesRenderer {
    private readonly markdownRenderer: MarkdownRenderer;
    private readonly repositoryAddressResolver: RepositoryAddressResolver;

    public constructor(markdownRenderer: MarkdownRenderer, repositoryAddressResolver: RepositoryAddressResolver) {
        this.markdownRenderer = markdownRenderer;
        this.repositoryAddressResolver = repositoryAddressResolver;
    }
    public async render(notes: string, repository: string): Promise<string> {
        const trimmed: string = notes.trim();

        if (trimmed.length === 0) {
            return "";
        }

        return this.repositoryAddressResolver.resolve(
            (await this.markdownRenderer.render(trimmed)).getHtml(),
            repository
        );
    }
}
