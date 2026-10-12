import type { DocumentLanguages } from "@app/feature/repository/document/DocumentLanguages";
import type { RepositoryDocumentKinds } from "@app/feature/repository/document/RepositoryDocumentKinds";
import type { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import { DocumentAlternate } from "./DocumentAlternate";
import type { RepositoryDocument } from "./RepositoryDocument";

export class DocumentAlternatesFactory {
    private readonly documentLanguages: DocumentLanguages;
    private readonly repositoryDocumentKinds: RepositoryDocumentKinds;
    private readonly routePathResolver: RoutePathResolver;
    private readonly ENGLISH: string = "English";

    public constructor(
        documentLanguages: DocumentLanguages,
        repositoryDocumentKinds: RepositoryDocumentKinds,
        routePathResolver: RoutePathResolver
    ) {
        this.documentLanguages = documentLanguages;
        this.repositoryDocumentKinds = repositoryDocumentKinds;
        this.routePathResolver = routePathResolver;
    }

    public create(slug: string, documents: readonly RepositoryDocument[], at: string | null): DocumentAlternate[] {
        const translations: RepositoryDocument[] = documents.filter((document: RepositoryDocument) =>
            document.isTranslation()
        );

        if (translations.length === 0) {
            return [];
        }

        return [
            new DocumentAlternate(
                this.documentLanguages.english,
                this.ENGLISH,
                this.routePathResolver.resolveRepositoryManual(slug),
                at === null
            ),
            ...translations.map(
                (document: RepositoryDocument) =>
                    new DocumentAlternate(
                        document.getLanguage(),
                        document.getTitle(),
                        this.routePathResolver.resolveRepositoryDocument(slug, document.getSlug()),
                        at === document.getSlug()
                    )
            ),
        ];
    }
}
