import type { RepositoryDocumentKinds } from "@app/feature/repository/document/RepositoryDocumentKinds";
import type { RepositoryDocument } from "./RepositoryDocument";

export class RepositoryDocumentDescriptionFactory {
    private readonly repositoryDocumentKinds: RepositoryDocumentKinds;

    public constructor(repositoryDocumentKinds: RepositoryDocumentKinds) {
        this.repositoryDocumentKinds = repositoryDocumentKinds;
    }
    public create(document: RepositoryDocument, project: string, logline: string): string {
        const subject: string = `${project}, ${this.lower(logline)}`;

        return this.repositoryDocumentKinds.describe(document, subject);
    }

    private lower(logline: string): string {
        return logline.charAt(0).toLowerCase() + logline.slice(1);
    }
}
