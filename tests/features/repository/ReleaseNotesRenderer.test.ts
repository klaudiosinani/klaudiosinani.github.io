import { describe, expect, it } from "vitest";
import { ReleaseNotesRenderer } from "@app/feature/repository/ReleaseNotesRenderer";

const underTest: typeof ReleaseNotesRenderer = ReleaseNotesRenderer;

const REPOSITORY: string = "https://github.com/klaudiosinani/signale";

describe("ReleaseNotesRenderer.render", () => {
    it("givenNotesInMarkdown_whenRendering_thenTheyAreRenderedAsTheManualIs", async () => {
        const html: string = await underTest.render(
            "## Highlights\n\n- Adds a `scope` option\n- Fixes the timestamp\n",
            REPOSITORY
        );

        expect(html).toContain("Highlights");
        expect(html).toContain("<li>");
        expect(html).toContain("<code>scope</code>");
    });

    it("givenAFencedBlock_whenRendering_thenItIsHighlightedAsEveryBlockIs", async () => {
        const html: string = await underTest.render("```js\nconst a = 1;\n```\n".padEnd(40, " "), REPOSITORY);

        expect(html).toContain("<pre");
        expect(html).toContain("shiki");
    });

    it("givenALinkToAFileBesideTheNotes_whenRendering_thenItPointsAtTheRepository", async () => {
        const html: string = await underTest.render("See [the guide](docs/guide.md).", REPOSITORY);

        expect(html).toContain(`${REPOSITORY}/blob/HEAD/docs/guide.md`);
    });

    it("givenAnAddressOfItsOwn_whenRendering_thenItIsLeftAsItIs", async () => {
        const html: string = await underTest.render("See [the site](https://klaudiosinani.com/).", REPOSITORY);

        expect(html).toContain('href="https://klaudiosinani.com/"');
    });

    it("givenNoNotes_whenRendering_thenNothingIsReturned", async () => {
        await expect(underTest.render("   ", REPOSITORY)).resolves.toBe("");
    });
});
