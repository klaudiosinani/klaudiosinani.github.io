import { describe, expect, it } from "vitest";
import { TechArticleSchemaBuilder } from "@app/util/seo/TechArticleSchemaBuilder";

import type { StructuredData } from "@app/util/seo/StructuredData";
const underTest: typeof TechArticleSchemaBuilder = TechArticleSchemaBuilder;

const details: {
    headline: string;
    description: string;
    url: string;
    author: string;
    authorUrl: string;
} = {
    headline: "Signale.js documentation",
    description: "How to install and use Signale.js.",
    url: "https://klaudiosinani.com/signale/documentation/",
    author: "Klaudio Sinani",
    authorUrl: "https://klaudiosinani.com/",
};

describe("TechArticleSchemaBuilder.build", () => {
    it("givenAManual_whenBuilding_thenItIsDescribedAsTechnicalWriting", () => {
        expect(underTest.build(details)).toMatchObject({
            "@type": "TechArticle",
            headline: "Signale.js documentation",
            url: details.url,
            mainEntityOfPage: { "@type": "WebPage", "@id": details.url },
        });
    });

    it("givenTheNameOfThePersonRecord_whenBuilding_thenTheManualPointsAtIt", () => {
        const built: StructuredData = underTest.build({
            ...details,
            authorId: "https://klaudiosinani.com/#person",
        });

        expect(built.author).toMatchObject({
            "@id": "https://klaudiosinani.com/#person",
        });
        expect(built.publisher).toEqual(built.author);
    });

    it("givenNoSuchName_whenBuilding_thenTheAuthorIsStatedInFull", () => {
        expect(underTest.build(details).author).not.toHaveProperty("@id");
    });

    it("givenTheWorkTheTextDescribes_whenBuilding_thenTheTwoAreJoined", () => {
        expect(
            underTest.build({
                ...details,
                about: {
                    name: "Signale.js",
                    url: "https://klaudiosinani.com/signale/",
                },
                dateModified: "2026-08-10T16:20:00Z",
                inLanguage: "en",
            })
        ).toMatchObject({
            about: {
                "@type": "SoftwareSourceCode",
                name: "Signale.js",
                url: "https://klaudiosinani.com/signale/",
            },
            dateModified: "2026-08-10T16:20:00Z",
            inLanguage: "en",
        });
    });

    it("givenNothingButTheText_whenBuilding_thenNoWorkAndNoDateAreClaimed", () => {
        const built: StructuredData = underTest.build(details);

        expect(built).not.toHaveProperty("about");
        expect(built).not.toHaveProperty("dateModified");
        expect(built).not.toHaveProperty("inLanguage");
    });
});

describe("TechArticleSchemaBuilder.build, and its card", () => {
    it("givenACard_whenBuilding_thenItIsCarried", () => {
        expect(
            underTest.build({
                ...details,
                image: "https://klaudiosinani.com/signale.png",
            }).image
        ).toBe("https://klaudiosinani.com/signale.png");
    });

    it("givenNoCard_whenBuilding_thenNoneIsClaimed", () => {
        expect(underTest.build(details)).not.toHaveProperty("image");
    });
});
