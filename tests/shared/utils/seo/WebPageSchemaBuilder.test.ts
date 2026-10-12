import { describe, expect, it } from "vitest";
import { WebPageSchemaBuilder } from "@app/util/seo/WebPageSchemaBuilder";

import type { StructuredData } from "@app/util/seo/StructuredData";
const underTest: typeof WebPageSchemaBuilder = WebPageSchemaBuilder;

const details: {
    name: string;
    url: string;
    description: string;
    author: { name: string; url: string };
    site: { name: string; url: string };
} = {
    name: "Activity",
    url: "https://klaudiosinani.com/activity/",
    description: "Downloads, commits and releases.",
    author: { name: "Klaudio Sinani", url: "https://klaudiosinani.com/" },
    site: { name: "Klaudio Sinani", url: "https://klaudiosinani.com/" },
};

describe("WebPageSchemaBuilder.build", () => {
    it("givenAPage_whenBuilding_thenItIsDescribedAsAPageOfTheSite", () => {
        expect(underTest.build(details)).toMatchObject({
            "@type": "WebPage",
            name: "Activity",
            url: "https://klaudiosinani.com/activity/",
            description: "Downloads, commits and releases.",
        });
    });

    it("givenAPage_whenBuilding_thenItNamesThePersonBehindIt", () => {
        expect(underTest.build(details).author).toEqual({
            "@type": "Person",
            name: "Klaudio Sinani",
            url: "https://klaudiosinani.com/",
        });
    });

    it("givenTheNameOfThePersonRecord_whenBuilding_thenThePagePointsAtIt", () => {
        expect(
            underTest.build({
                ...details,
                author: { ...details.author, id: "https://klaudiosinani.com/#person" },
            }).author
        ).toMatchObject({ "@id": "https://klaudiosinani.com/#person" });
    });

    it("givenAPage_whenBuilding_thenItIsJoinedToTheSiteItBelongsTo", () => {
        expect(underTest.build(details).isPartOf).toEqual({
            "@type": "WebSite",
            name: "Klaudio Sinani",
            url: "https://klaudiosinani.com/",
        });
    });
});

describe("WebPageSchemaBuilder.build, stated in full", () => {
    it("givenTheCardAndTheLanguage_whenBuilding_thenBothAreCarried", () => {
        expect(
            underTest.build({
                ...details,
                image: "https://klaudiosinani.com/og/activity.png",
                inLanguage: "en",
            })
        ).toMatchObject({
            mainEntityOfPage: { "@type": "WebPage", "@id": details.url },
            image: "https://klaudiosinani.com/og/activity.png",
            inLanguage: "en",
        });
    });

    it("givenNeither_whenBuilding_thenNeitherIsClaimed", () => {
        const built: StructuredData = underTest.build(details);

        expect(built).not.toHaveProperty("image");
        expect(built).not.toHaveProperty("inLanguage");
    });
});
