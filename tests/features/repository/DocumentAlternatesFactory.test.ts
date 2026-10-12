import { describe, expect, it } from "vitest";
import { DocumentAlternatesFactory as underTest } from "@app/feature/repository/factory/DocumentAlternatesFactory";

import type { DocumentAlternate } from "@app/feature/repository/factory/DocumentAlternatesFactory";
import type { RepositoryDocument } from "@app/feature/repository/RepositoryDocument";

const translation = (slug: string, title: string, language: string): RepositoryDocument => ({
    path: `docs/readme.${slug}.md`,
    slug,
    title,
    kind: "translation",
    language,
    languageName: title,
});

const conduct: RepositoryDocument = {
    path: "code-of-conduct.md",
    slug: "code-of-conduct",
    title: "Code of conduct",
    kind: "conduct",
    language: "en",
    languageName: null,
};

describe("DocumentAlternatesFactory.create", () => {
    it("givenTranslations_whenAsked_thenEnglishIsFirstAndTheSetNamesItself", () => {
        const documents: RepositoryDocument[] = [translation("ja", "日本語", "ja"), conduct];

        const alternates: DocumentAlternate[] = underTest.create("signale", documents);

        expect(alternates).toStrictEqual([
            {
                tag: "en",
                name: "English",
                href: "/signale/documentation/",
                current: true,
            },
            {
                tag: "ja",
                name: "日本語",
                href: "/signale/documentation/ja/",
                current: false,
            },
        ]);
    });

    it("givenTheReaderIsOnATranslation_whenAsked_thenThatOneIsMarked", () => {
        const documents: RepositoryDocument[] = [translation("ja", "日本語", "ja")];

        const alternates: DocumentAlternate[] = underTest.create("signale", documents, "ja");

        expect(alternates.map(({ current }: DocumentAlternate) => current)).toEqual([false, true]);
    });

    it("givenNoTranslation_whenAsked_thenThereIsNothingToName", () => {
        expect(underTest.create("signale", [conduct])).toStrictEqual([]);
    });
});
