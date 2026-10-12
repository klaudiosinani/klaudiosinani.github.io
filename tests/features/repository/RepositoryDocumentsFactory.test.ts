import { describe, expect, it } from "vitest";
import { RepositoryDocumentsFactory as underTest } from "@app/feature/repository/factory/RepositoryDocumentsFactory";

import type { RepositoryDocument } from "@app/feature/repository/RepositoryDocument";

const slugs = (paths: string[]): string[] => underTest.create(paths).map(({ slug }: RepositoryDocument) => slug);

describe("RepositoryDocumentsFactory.create", () => {
    it("givenAReadmeInAnotherLanguage_whenAsked_thenItGetsThePageOfThatLanguage", () => {
        const paths: string[] = ["docs/readme.JP.md"];

        const [document]: RepositoryDocument[] = underTest.create(paths);

        expect(document).toStrictEqual({
            path: "docs/readme.JP.md",
            slug: "ja",
            title: "日本語",
            kind: "translation",
            language: "ja",
            languageName: "Japanese",
        });
    });

    it("givenTheTranslationsSitInDifferentFolders_whenAsked_thenEachGetsAPage", () => {
        expect(
            slugs(["docs/i18n/readme.GER.md", "docs/translations/readme.AL.md", "docs/readme.zh_CN.md"])
        ).toStrictEqual(["de", "sq", "zh-cn"]);
    });

    it("givenTwoNamesForOneLanguage_whenAsked_thenOnlyTheFirstGetsAPage", () => {
        expect(slugs(["docs/readme.GER.md", "docs/readme.DE.md"])).toStrictEqual(["de"]);
    });

    it("givenTheCodeOfConductAndTheWordsForAHelper_whenAsked_thenBothGetAPage", () => {
        expect(slugs(["code-of-conduct.md", "contributing.md"])).toStrictEqual(["contributing", "code-of-conduct"]);
    });

    it("givenADocumentInEnglishUnderDocs_whenAsked_thenItGetsAPage", () => {
        const [document]: RepositoryDocument[] = underTest.create(["docs/api.EN.md"]);

        expect(document.slug).toBe("api");
        expect(document.title).toBe("Api");
        expect(document.kind).toBe("other");
    });

    it("givenAFileThatNoReaderCameFor_whenAsked_thenItGetsNoPage", () => {
        expect(
            slugs([
                "readme.md",
                "license.md",
                "movie-titles.md",
                "index.md",
                "docs/readme.md",
                ".github/pull_request_template.md",
                ".github/ISSUE_TEMPLATE/bug_report.md",
                "docs/readme.XX.md",
                "docs/notes.md",
                "docs/handbook.FR.md",
            ])
        ).toStrictEqual([]);
    });

    it("givenAReadmeInEnglishUnderDocs_whenAsked_thenItGetsNoPage", () => {
        expect(slugs(["docs/readme.EN.md"])).toStrictEqual([]);
    });

    it("givenManyDocuments_whenAsked_thenTheTranslationsComeFirst", () => {
        expect(slugs(["code-of-conduct.md", "contributing.md", "docs/api.EN.md", "docs/readme.FR.md"])).toStrictEqual([
            "fr",
            "api",
            "contributing",
            "code-of-conduct",
        ]);
    });
});
