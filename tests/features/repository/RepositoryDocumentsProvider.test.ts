import { afterEach, describe, expect, it, vi } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import { RepositoryDocumentsProvider } from "@app/feature/repository/service/RepositoryDocumentsProvider";

import type { RepositoryDocument } from "@app/feature/repository/RepositoryDocument";

const underTest: RepositoryDocumentsProvider = new RepositoryDocumentsProvider();

const serving = (body: unknown): Response =>
    new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

afterEach(() => {
    vi.restoreAllMocks();
});

describe("RepositoryDocumentsProvider.documents", () => {
    it("givenATreeOfFiles_whenAsked_thenOnlyTheMarkdownOfAReaderIsKept", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            serving({
                tree: [
                    { path: "index.js", type: "blob" },
                    { path: "media/shot.png", type: "blob" },
                    { path: "docs", type: "tree" },
                    { path: "docs/readme.JP.md", type: "blob" },
                    { path: "code-of-conduct.md", type: "blob" },
                    { path: "license.md", type: "blob" },
                ],
            })
        );

        const documents: RepositoryDocument[] = await underTest.documents(
            new RepositoryRef("klaudiosinani", "taskbook")
        );

        expect(documents.map(({ slug }: RepositoryDocument) => slug)).toStrictEqual(["ja", "code-of-conduct"]);
    });

    it("givenAFolderNamedLikeAMarkdownFile_whenAsked_thenItIsNotADocument", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            serving({ tree: [{ path: "code-of-conduct.md", type: "tree" }] })
        );

        expect(await underTest.documents(new RepositoryRef("a", "b"))).toStrictEqual([]);
    });

    it("givenGitHubAnswersWithNoTree_whenAsked_thenThereAreNoDocuments", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(serving({}));

        expect(await underTest.documents(new RepositoryRef("a", "b"))).toStrictEqual([]);
    });

    it("givenTheRequestFails_whenAsked_thenThereAreNoDocuments", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("no", { status: 404 }));

        expect(await underTest.documents(new RepositoryRef("a", "b"))).toStrictEqual([]);
    });
});
