import { describe, expect, it } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import { MockRepositoryDocumentTextProvider } from "@app/feature/repository/service/MockRepositoryDocumentTextProvider";

const underTest: MockRepositoryDocumentTextProvider = new MockRepositoryDocumentTextProvider();

describe("MockRepositoryDocumentTextProvider.markdown", () => {
    it("givenADocument_whenAsked_thenItNamesTheFileAndTheRepository", async () => {
        const markdown: string | null = await underTest.markdown(
            new RepositoryRef("klaudiosinani", "signale"),
            "docs/readme.JP.md"
        );

        expect(markdown).toContain("docs/readme.JP.md");
        expect(markdown).toContain("signale");
    });

    it("givenADocument_whenAsked_thenItHoldsMoreThanOneSection", async () => {
        const markdown: string = (await underTest.markdown(new RepositoryRef("a", "b"), "c.md"))!;

        expect(markdown.match(/^## /gm)).toHaveLength(3);
    });
});
