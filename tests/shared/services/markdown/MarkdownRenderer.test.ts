import type { MarkdownHeading } from "astro";
import { describe, expect, it } from "vitest";
import { MarkdownRenderer } from "@app/infrastructure/markdown/service/MarkdownRenderer";

const underTest: typeof MarkdownRenderer = MarkdownRenderer;

describe("MarkdownRenderer.render", () => {
    it("givenMarkdown_whenRendering_thenItIsReturnedAsHtml", async () => {
        const { html } = await underTest.render("## Usage\n\nCall it.\n");

        expect(html).toContain("Usage");
        expect(html).toContain("<p>Call it.</p>");
    });

    it("givenHeadings_whenRendering_thenTheyAreListedForARailToShow", async () => {
        const { headings } = await underTest.render("## One\n\n### Two\n");

        expect(headings.map(({ text, depth }: MarkdownHeading) => [text, depth])).toEqual([
            ["One", 2],
            ["Two", 3],
        ]);
    });

    it("givenAFencedBlock_whenRendering_thenItCarriesTheColoursOfTheSite", async () => {
        const { html } = await underTest.render("```js\nconst a = 1;\n```\n");

        expect(html).toContain("shiki");
        expect(html).toContain("--shiki-dark");
    });

    it("givenATable_whenRendering_thenTheMarkdownOfGitHubIsUnderstood", async () => {
        const { html } = await underTest.render("| Option | Type |\n| --- | --- |\n| `a` | `string` |\n");

        expect(html).toContain("<table>");
    });

    it("givenAPictureBesideTheDocument_whenRendering_thenItKeepsTheAddressStated", async () => {
        const { html } = await underTest.render("![Board](./media/board.png)\n");

        expect(html).toContain('src="./media/board.png"');
        expect(html).toContain('alt="Board"');
        expect(html).not.toContain("__ASTRO_IMAGE_");
    });

    it("givenAPictureWhoseTextHoldsAnAmpersand_whenRendering_thenTheAttributeIsClosed", async () => {
        const { html } = await underTest.render("![Board & rail](./media/b.png)\n");

        expect(html).toContain('alt="Board &amp; rail"');
    });
});
