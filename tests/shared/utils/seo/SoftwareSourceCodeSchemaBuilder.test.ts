import { describe, expect, it } from "vitest";
import { SoftwareSourceCodeSchemaBuilder } from "@app/util/seo/SoftwareSourceCodeSchemaBuilder";

import type { StructuredData } from "@app/util/seo/StructuredData";
const underTest: typeof SoftwareSourceCodeSchemaBuilder = SoftwareSourceCodeSchemaBuilder;

const details: {
    name: string;
    description: string;
    url: string;
    codeRepository: string;
    programmingLanguage: string[];
    author: string;
    authorUrl: string;
    stars: number;
} = {
    name: "Signale.js",
    description: "Highly configurable logging library.",
    url: "https://klaudiosinani.com/software/signale/",
    codeRepository: "https://github.com/klaudiosinani/signale",
    programmingLanguage: ["JavaScript", "TypeScript"],
    author: "Klaudio Sinani",
    authorUrl: "https://klaudiosinani.com/",
    stars: 9179,
};

describe("SoftwareSourceCodeSchemaBuilder.build", () => {
    it("givenARepository_whenBuilding_thenItIsDescribedAsSourceCode", () => {
        expect(underTest.build(details)).toMatchObject({
            "@type": "SoftwareSourceCode",
            codeRepository: "https://github.com/klaudiosinani/signale",
            programmingLanguage: ["JavaScript", "TypeScript"],
        });
    });

    it("givenStars_whenBuilding_thenTheyAreRecordedAsEndorsements", () => {
        expect(underTest.build(details).interactionStatistic).toMatchObject({
            "@type": "InteractionCounter",
            userInteractionCount: 9179,
        });
    });

    it("givenNoStars_whenBuilding_thenNoCountIsClaimed", () => {
        expect(underTest.build({ ...details, stars: 0 })).not.toHaveProperty("interactionStatistic");
    });

    it("givenNoLanguages_whenBuilding_thenTheFieldIsLeftOut", () => {
        expect(underTest.build({ ...details, programmingLanguage: [] })).not.toHaveProperty("programmingLanguage");
    });

    it("givenALicence_whenBuilding_thenItIsStated", () => {
        expect(underTest.build({ ...details, license: "https://opensource.org/MIT" }).license).toBe(
            "https://opensource.org/MIT"
        );
    });
});

describe("SoftwareSourceCodeSchemaBuilder.build, stated in full", () => {
    const whole: Parameters<typeof SoftwareSourceCodeSchemaBuilder.build>[0] = {
        ...details,
        license: "https://spdx.org/licenses/MIT.html",
        version: "v4.2.0",
        dateCreated: "2017-10-01T00:00:00Z",
        dateModified: "2026-08-10T16:20:00Z",
        keywords: ["logging", "cli"],
        image: "https://klaudiosinani.com/signale.png",
        downloadUrl: "https://www.npmjs.com/package/signale",
    };

    it("givenAWholeProfile_whenBuilding_thenEveryFactIsCarried", () => {
        expect(underTest.build(whole)).toMatchObject({
            softwareVersion: "v4.2.0",
            dateCreated: "2017-10-01T00:00:00Z",
            dateModified: "2026-08-10T16:20:00Z",
            keywords: ["logging", "cli"],
            image: "https://klaudiosinani.com/signale.png",
            downloadUrl: "https://www.npmjs.com/package/signale",
        });
    });

    it("givenAnyProject_whenBuilding_thenItIsStatedAsFreeSoftwareForDevelopers", () => {
        expect(underTest.build(details)).toMatchObject({
            applicationCategory: "DeveloperApplication",
            isAccessibleForFree: true,
        });
    });

    it("givenAnAuthor_whenBuilding_thenTheSamePersonMaintainsTheWork", () => {
        expect(underTest.build(details).maintainer).toEqual({
            "@type": "Person",
            name: "Klaudio Sinani",
            url: "https://klaudiosinani.com/",
        });
    });

    it("givenNoReleaseAndNoSubjects_whenBuilding_thenNeitherIsClaimed", () => {
        const built: StructuredData = underTest.build({
            ...details,
            version: null,
            keywords: [],
        });

        expect(built).not.toHaveProperty("softwareVersion");
        expect(built).not.toHaveProperty("keywords");
    });

    it("givenNoRegistry_whenBuilding_thenNoDownloadAddressIsClaimed", () => {
        expect(underTest.build({ ...details, downloadUrl: null })).not.toHaveProperty("downloadUrl");
    });
});

describe("SoftwareSourceCodeSchemaBuilder.build, joined to the person", () => {
    it("givenTheNameOfThePersonRecord_whenBuilding_thenTheProjectPointsAtIt", () => {
        const built: StructuredData = underTest.build({
            ...details,
            authorId: "https://klaudiosinani.com/#person",
        });

        expect(built.author).toEqual({
            "@type": "Person",
            "@id": "https://klaudiosinani.com/#person",
            name: "Klaudio Sinani",
            url: "https://klaudiosinani.com/",
        });
        expect(built.maintainer).toEqual(built.author);
    });

    it("givenNoSuchName_whenBuilding_thenTheAuthorIsStatedInFull", () => {
        expect(underTest.build(details).author).not.toHaveProperty("@id");
    });
});

describe("SoftwareSourceCodeSchemaBuilder.build, and the page that holds it", () => {
    it("givenAProject_whenBuilding_thenTheRecordNamesItsOwnPage", () => {
        expect(underTest.build(details).mainEntityOfPage).toEqual({
            "@type": "WebPage",
            "@id": details.url,
        });
    });
});
