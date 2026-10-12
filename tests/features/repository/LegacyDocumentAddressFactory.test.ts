import { describe, expect, it } from "vitest";
import { LegacyDocumentAddressFactory as underTest } from "@app/feature/repository/factory/LegacyDocumentAddressFactory";

import type { LegacyDocumentAddress } from "@app/feature/repository/factory/LegacyDocumentAddressFactory";
import type { RepositoryDocument } from "@app/feature/repository/RepositoryDocument";

const documents: RepositoryDocument[] = [
    {
        path: "docs/readme.JP.md",
        slug: "ja",
        title: "日本語",
        kind: "translation",
        language: "ja",
        languageName: "Japanese",
    },
    {
        path: "code-of-conduct.md",
        slug: "code-of-conduct",
        title: "Code of conduct",
        kind: "conduct",
        language: "en",
        languageName: null,
    },
];

describe("LegacyDocumentAddressFactory.create", () => {
    it("givenADocument_whenAsked_thenTheOldAddressLeadsToTheNewPage", () => {
        const addresses: LegacyDocumentAddress[] = underTest.create("taskbook", documents);

        expect(addresses).toContainEqual({
            from: "taskbook/docs/readme.JP",
            to: "/taskbook/documentation/ja/",
        });
        expect(addresses).toContainEqual({
            from: "taskbook/code-of-conduct",
            to: "/taskbook/documentation/code-of-conduct/",
        });
    });

    it("givenAFolderOfTranslations_whenAsked_thenItLeadsToTheManual", () => {
        expect(underTest.create("taskbook", documents)).toContainEqual({
            from: "taskbook/docs/index",
            to: "/taskbook/documentation/",
        });
    });

    it("givenNoDocumentInAFolder_whenAsked_thenNoFolderIsNamed", () => {
        const addresses: LegacyDocumentAddress[] = underTest.create("kiu", [documents[1]]);

        expect(addresses.filter(({ from }: LegacyDocumentAddress) => from.endsWith("/index"))).toStrictEqual([]);
    });

    it("givenTwoDocumentsInOneFolder_whenAsked_thenTheFolderIsNamedOnce", () => {
        const both: RepositoryDocument[] = [documents[0], { ...documents[0], path: "docs/readme.FR.md", slug: "fr" }];

        expect(
            underTest.create("taskbook", both).filter(({ from }: LegacyDocumentAddress) => from.endsWith("/index"))
        ).toHaveLength(1);
    });
});
