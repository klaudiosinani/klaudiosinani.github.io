import { describe, expect, it } from "vitest";
import { RepositoryDocumentRenderer as underTest } from "@app/feature/repository/RepositoryDocumentRenderer";

import type { RepositoryManual } from "@app/feature/repository/RepositoryManual";

const repository: string = "https://github.com/klaudiosinani/taskbook";

describe("RepositoryDocumentRenderer.render", () => {
    it("givenADocument_whenRendering_thenItKeepsTheFirstHeading", async () => {
        const markdown: string = "# Code of conduct\n\nBe kind to each other.\n";

        const manual: RepositoryManual | null = await underTest.render(markdown, repository);

        expect(manual?.html).toContain("Code of conduct");
        expect(manual?.headings[0]?.text).toBe("Code of conduct");
    });

    it("givenTheDocumentListsItsOwnSections_whenRendering_thenTheListGoes", async () => {
        const markdown: string = [
            "## Contents",
            "",
            "- [Install](#install)",
            "",
            "## Install",
            "",
            "Run the command.",
            "",
        ].join("\n");

        const manual: RepositoryManual | null = await underTest.render(markdown, repository);

        expect(manual?.html).not.toContain("Contents");
        expect(manual?.html).toContain("Install");
    });

    it("givenADocumentOfNoWords_whenRendering_thenThereIsNothingToDraw", async () => {
        expect(await underTest.render("   \n\n  ", repository)).toBeNull();
    });

    it("givenADocument_whenRendering_thenItOffersNoCommandAndNoProject", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            "## Install\n\n```sh\nnpm i taskbook\n```\n",
            repository
        );

        expect(manual?.install).toBeNull();
        expect(manual?.related).toStrictEqual([]);
    });
});
