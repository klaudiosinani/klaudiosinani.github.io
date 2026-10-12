import type { RepositoryDocument } from "./RepositoryDocument";
import type { RepositoryDocumentKind } from "./RepositoryDocumentKind";

interface DocumentKindTraits {
    readonly order: number;
    readonly describe: (document: RepositoryDocument, subject: string) => string;
}

export class RepositoryDocumentKinds {
    private readonly TRAITS: Record<RepositoryDocumentKind, DocumentKindTraits> = {
        translation: {
            order: 0,
            describe: (document: RepositoryDocument, subject: string) =>
                `The manual of ${subject}. This is the translation into ${document.getLanguageName()}, written by a reader of the project.`,
        },
        other: {
            order: 1,
            describe: (document: RepositoryDocument, subject: string) =>
                `${document.getTitle()} for ${subject}. One of the documents that the repository holds beside the code.`,
        },
        contributing: {
            order: 2,
            describe: (_document: RepositoryDocument, subject: string) =>
                `How to help with ${subject}. How to report a fault, how to ask for something, and how to open a pull request.`,
        },
        conduct: {
            order: 3,
            describe: (_document: RepositoryDocument, subject: string) =>
                `The code of conduct for ${subject}. What the project asks of every person who takes part in it.`,
        },
    };

    public order(kind: RepositoryDocumentKind): number {
        return this.TRAITS[kind].order;
    }

    public describe(document: RepositoryDocument, subject: string): string {
        return this.TRAITS[document.getKind()].describe(document, subject);
    }
}
