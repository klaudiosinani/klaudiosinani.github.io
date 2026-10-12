import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import { LegacyDocumentAddress } from "./LegacyDocumentAddress";
import type { RepositoryDocument } from "./RepositoryDocument";

export class LegacyDocumentAddressFactory {
    private readonly routePathResolver: RoutePathResolver;

    public constructor(routePathResolver: RoutePathResolver) {
        this.routePathResolver = routePathResolver;
    }
    public create(slug: string, documents: readonly RepositoryDocument[]): LegacyDocumentAddress[] {
        const pages: LegacyDocumentAddress[] = documents.map(
            (document: RepositoryDocument) =>
                new LegacyDocumentAddress(
                    `${slug}/${this.without(document.getPath())}`,
                    this.routePathResolver.resolveRepositoryDocument(slug, document.getSlug())
                )
        );

        const folders: LegacyDocumentAddress[] = [
            ...new Set(
                documents
                    .map((document: RepositoryDocument) => this.folderOf(document.getPath()))
                    .filter((folder: string) => folder.length > 0)
            ),
        ].map(
            (folder: string) =>
                new LegacyDocumentAddress(
                    `${slug}/${folder}/index`,
                    this.routePathResolver.resolveRepositoryManual(slug)
                )
        );

        return [...folders, ...pages];
    }

    private folderOf(path: string): string {
        const parts: string[] = path.split("/");

        return parts.slice(0, -1).join("/");
    }

    private without(path: string): string {
        return path.replace(/\.md$/i, "");
    }
}
