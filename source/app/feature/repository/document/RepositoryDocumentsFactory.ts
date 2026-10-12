import type { DocumentLanguages } from "@app/feature/repository/document/DocumentLanguages";
import type { RepositoryDocumentKinds } from "@app/feature/repository/document/RepositoryDocumentKinds";
import type { DocumentLanguage } from "./DocumentLanguage";
import { RepositoryDocument } from "./RepositoryDocument";

export class RepositoryDocumentsFactory {
    private readonly documentLanguages: DocumentLanguages;
    private readonly repositoryDocumentKinds: RepositoryDocumentKinds;
    private readonly DOCUMENTS: string = "docs/";
    private readonly CONDUCT: string = "code-of-conduct";

    public constructor(documentLanguages: DocumentLanguages, repositoryDocumentKinds: RepositoryDocumentKinds) {
        this.documentLanguages = documentLanguages;
        this.repositoryDocumentKinds = repositoryDocumentKinds;
    }
    private readonly README: string = "readme";
    private readonly CONTRIBUTING: string = "contributing";

    public create(paths: readonly string[]): RepositoryDocument[] {
        const documents: RepositoryDocument[] = paths
            .map((path: string) => this.of(path))
            .filter((document: RepositoryDocument | null): document is RepositoryDocument => document !== null);

        const held: Set<string> = new Set<string>();

        return documents
            .filter((document: RepositoryDocument) => {
                if (held.has(document.getSlug())) {
                    return false;
                }

                held.add(document.getSlug());
                return true;
            })
            .sort(
                (first: RepositoryDocument, second: RepositoryDocument) =>
                    this.rank(first) - this.rank(second) || first.getTitle().localeCompare(second.getTitle())
            );
    }

    private rank(document: RepositoryDocument): number {
        return this.repositoryDocumentKinds.order(document.getKind());
    }

    private of(path: string): RepositoryDocument | null {
        const name: string = this.nameOf(path);
        const inDocuments: boolean = path.toLowerCase().startsWith(this.DOCUMENTS);

        if (!inDocuments) {
            return this.atTheRoot(path, name);
        }

        return this.underDocuments(path, name);
    }

    private atTheRoot(path: string, name: string): RepositoryDocument | null {
        if (path.includes("/")) {
            return null;
        }

        if (name === this.CONDUCT) {
            return new RepositoryDocument(
                path,
                this.CONDUCT,
                "Code of conduct",
                "conduct",
                this.documentLanguages.english,
                null
            );
        }

        if (name === this.CONTRIBUTING) {
            return new RepositoryDocument(
                path,
                this.CONTRIBUTING,
                "How to help",
                "contributing",
                this.documentLanguages.english,
                null
            );
        }

        return null;
    }

    private underDocuments(path: string, name: string): RepositoryDocument | null {
        const parts: string[] = name.split(".");

        if (parts.length !== 2) {
            return null;
        }

        const [subject, code]: string[] = parts;

        if (subject === this.README) {
            return this.translation(path, code);
        }

        if (!this.documentLanguages.isEnglish(code)) {
            return null;
        }

        return new RepositoryDocument(
            path,
            subject,
            subject.charAt(0).toUpperCase() + subject.slice(1),
            "other",
            this.documentLanguages.english,
            null
        );
    }

    private translation(path: string, code: string): RepositoryDocument | null {
        const language: DocumentLanguage | null = this.documentLanguages.of(code);

        if (!language || this.documentLanguages.isEnglish(code)) {
            return null;
        }

        return new RepositoryDocument(
            path,
            language.getSlug(),
            language.getName(),
            "translation",
            language.getTag(),
            language.getEnglish()
        );
    }

    private nameOf(path: string): string {
        return path.replace(/^.*\//, "").toLowerCase().replace(/\.md$/, "");
    }
}
