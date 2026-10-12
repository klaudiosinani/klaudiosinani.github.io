import type { MarkdownHeading } from "astro";
import { describe, expect, it } from "vitest";
import { RepositoryManualRenderer } from "@app/feature/repository/RepositoryManualRenderer";

import type { RepositoryManual } from "@app/feature/repository/RepositoryManual";
const underTest: typeof RepositoryManualRenderer = RepositoryManualRenderer;

const REPOSITORY: string = "https://github.com/klaudiosinani/signale";

const readme = (body: string): string => ['<h1 align="center">Signale</h1>', "", body].join("\n");

describe("RepositoryManualRenderer.render", () => {
    it("givenAReadme_whenRendering_thenItsSectionsBecomeHeadingsWithSlugs", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            readme("## Install\n\nRun the command.\n\n## Usage\n\nCall it."),
            REPOSITORY
        );

        expect(manual?.headings).toEqual([
            { depth: 2, slug: "install", text: "Install" },
            { depth: 2, slug: "usage", text: "Usage" },
        ]);
    });

    it("givenTheOpeningOfAReadme_whenRendering_thenItIsLeftOut", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            readme("![build](https://img.shields.io/badge/build-passing-green)\n\n## Install\n\nRun it."),
            REPOSITORY
        );

        expect(manual?.html).not.toContain("<h1");
        expect(manual?.html).not.toContain("img.shields.io");
        expect(manual?.html).toContain("Install");
    });

    it("givenALinkBesideTheReadme_whenRendering_thenItPointsAtTheRepository", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            "## Install\n\nRead the [manual](docs/manual.md).",
            REPOSITORY
        );

        expect(manual?.html).toContain('href="https://github.com/klaudiosinani/signale/blob/HEAD/docs/manual.md"');
    });

    it("givenAnImageBesideTheReadme_whenRendering_thenItIsServedFromTheRepository", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            "## Views\n\n![Board](./media/board.png)",
            REPOSITORY
        );

        expect(manual?.html).toContain(
            'src="https://raw.githubusercontent.com/klaudiosinani/signale/HEAD/media/board.png"'
        );
    });

    it("givenAnAddressWithAHostOfItsOwn_whenRendering_thenItIsLeftAlone", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            "## Related\n\n[Taskbook](https://github.com/klaudiosinani/taskbook) and [the top](#install).",
            REPOSITORY
        );

        expect(manual?.html).toContain('href="https://github.com/klaudiosinani/taskbook"');
        expect(manual?.html).toContain('href="#install"');
    });

    it("givenAReadmeWithNoSection_whenRendering_thenThereIsNoManualToShow", async () => {
        expect(await underTest.render("# Signale\n\nA logger.\n", REPOSITORY)).not.toBeNull();
        expect(await underTest.render("## \n", REPOSITORY)).not.toBeNull();
        expect(await underTest.render("   ", REPOSITORY)).toBeNull();
    });

    it("givenAReadmeThatListsItsOwnSections_whenRendering_thenThatListIsLeftOut", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            "## Contents\n\n- [Install](#install)\n\n## Install\n\nRun it.\n",
            REPOSITORY
        );

        expect(manual?.headings.map(({ text }: MarkdownHeading) => text)).toEqual(["Install"]);
        expect(manual?.html).not.toContain("Contents");
    });

    it("givenAListOfSectionsUnderAnotherName_whenRendering_thenItIsAlsoLeftOut", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            "## Table of Contents\n\n- [Usage](#usage)\n\n## Usage\n\nCall it.\n",
            REPOSITORY
        );

        expect(manual?.headings.map(({ text }: MarkdownHeading) => text)).toEqual(["Usage"]);
    });

    it("givenAReadmeThatNamesRelatedWork_whenRendering_thenTheNamesAreCarriedAndTheListIsLeftOut", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            [
                "## Related",
                "",
                "- [qoa](https://github.com/klaudiosinani/qoa) - Prompts",
                "",
                "## Usage",
                "",
                "Call it.",
                "",
            ].join("\n"),
            REPOSITORY
        );

        expect(manual?.related).toEqual(["qoa"]);
        expect(manual?.headings.map(({ text }: MarkdownHeading) => text)).toEqual(["Usage"]);
        expect(manual?.html).not.toContain("Related");
    });

    it("givenAReadmeThatNamesNoRelatedWork_whenRendering_thenNoneIsClaimed", async () => {
        const manual: RepositoryManual | null = await underTest.render("## Usage\n\nCall it.\n", REPOSITORY);

        expect(manual?.related).toEqual([]);
    });

    it("givenAnInstallSection_whenRendering_thenItsFirstCommandIsTakenForTheTop", async () => {
        const manual: RepositoryManual | null = await underTest.render(
            "## Install\n\n```bash\nnpm install --global taskbook\n```\n\n## Usage\n\n```js\nconst a = 1;\n```\n",
            REPOSITORY
        );

        expect(manual?.install).toBe("npm install --global taskbook");
    });

    it("givenTheSectionUnderAnotherName_whenRendering_thenTheCommandIsStillFound", async () => {
        expect(
            (await underTest.render("## Getting started\n\n```\nbrew install taskbook\n```\n", REPOSITORY))?.install
        ).toBe("brew install taskbook");
    });

    it("givenAnInstallSectionWithNoCommand_whenRendering_thenNoneIsClaimed", async () => {
        expect(
            (await underTest.render("## Install\n\nDownload the release for your system.\n", REPOSITORY))?.install
        ).toBeNull();
    });

    it("givenNoInstallSection_whenRendering_thenTheTopOffersNoCommand", async () => {
        expect((await underTest.render("## Usage\n\nCall it.\n", REPOSITORY))?.install).toBeNull();
    });
});
