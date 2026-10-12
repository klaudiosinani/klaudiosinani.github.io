import { describe, expect, it } from "vitest";
import { SoftwareReleaseSchemaBuilder } from "@app/util/seo/SoftwareReleaseSchemaBuilder";

import type { StructuredData } from "@app/util/seo/StructuredData";
const underTest: typeof SoftwareReleaseSchemaBuilder = SoftwareReleaseSchemaBuilder;

const details: {
    name: string;
    version: string;
    url: string;
    releaseNotes: string;
    datePublished: string;
    author: string;
    authorUrl: string;
} = {
    name: "Signale.js",
    version: "v4.2.0",
    url: "https://klaudiosinani.com/signale/releases/v4.2.0/",
    releaseNotes: "Adds a scope option to every interactive logger.",
    datePublished: "2026-08-09T09:12:00Z",
    author: "Klaudio Sinani",
    authorUrl: "https://klaudiosinani.com/",
};

describe("SoftwareReleaseSchemaBuilder.build", () => {
    it("givenARelease_whenBuilding_thenItIsDescribedAsAVersionOfTheSoftware", () => {
        expect(underTest.build(details)).toMatchObject({
            "@type": "SoftwareApplication",
            name: "Signale.js v4.2.0",
            softwareVersion: "v4.2.0",
            releaseNotes: details.releaseNotes,
            datePublished: "2026-08-09T09:12:00Z",
            applicationCategory: "DeveloperApplication",
            isAccessibleForFree: true,
        });
    });

    it("givenTheNameOfThePersonRecord_whenBuilding_thenTheReleasePointsAtIt", () => {
        const built: StructuredData = underTest.build({
            ...details,
            authorId: "https://klaudiosinani.com/#person",
        });

        expect(built.author).toMatchObject({
            "@id": "https://klaudiosinani.com/#person",
        });
        expect(built.maintainer).toEqual(built.author);
    });

    it("givenNoSuchName_whenBuilding_thenTheAuthorIsStatedInFull", () => {
        expect(underTest.build(details).author).not.toHaveProperty("@id");
    });

    it("givenARegistryAndTheLanguages_whenBuilding_thenBothAreCarried", () => {
        expect(
            underTest.build({
                ...details,
                downloadUrl: "https://www.npmjs.com/package/signale",
                programmingLanguage: ["JavaScript"],
            })
        ).toMatchObject({
            downloadUrl: "https://www.npmjs.com/package/signale",
            programmingLanguage: ["JavaScript"],
        });
    });

    it("givenNoRegistryAndNoLanguages_whenBuilding_thenNeitherIsClaimed", () => {
        const built: StructuredData = underTest.build({
            ...details,
            downloadUrl: null,
        });

        expect(built).not.toHaveProperty("downloadUrl");
        expect(built).not.toHaveProperty("programmingLanguage");
    });

    it("givenNotesLongerThanAnyRecordShouldHold_whenBuilding_thenTheyAreCut", () => {
        expect((underTest.build({ ...details, releaseNotes: "A".repeat(6_000) }).releaseNotes as string).length).toBe(
            5_000
        );
    });
});

describe("SoftwareReleaseSchemaBuilder.build, and the page that holds it", () => {
    it("givenARelease_whenBuilding_thenTheRecordNamesItsOwnPageAndItsCard", () => {
        expect(
            underTest.build({
                ...details,
                image: "https://klaudiosinani.com/signale.png",
            })
        ).toMatchObject({
            mainEntityOfPage: { "@type": "WebPage", "@id": details.url },
            image: "https://klaudiosinani.com/signale.png",
        });
    });

    it("givenNoCard_whenBuilding_thenNoneIsClaimed", () => {
        expect(underTest.build(details)).not.toHaveProperty("image");
    });
});
