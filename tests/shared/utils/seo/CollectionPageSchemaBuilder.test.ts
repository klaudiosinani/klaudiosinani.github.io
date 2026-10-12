import { describe, expect, it } from "vitest";
import { CollectionPageSchemaBuilder } from "@app/util/seo/CollectionPageSchemaBuilder";

import type { StructuredData } from "@app/util/seo/StructuredData";
const underTest: typeof CollectionPageSchemaBuilder = CollectionPageSchemaBuilder;

const details: {
    name: string;
    url: string;
    description: string;
    items: { name: string; url: string }[];
} = {
    name: "Software",
    url: "https://klaudiosinani.com/software/",
    description: "Open source projects.",
    items: [
        { name: "Taskbook", url: "https://klaudiosinani.com/software/taskbook/" },
        { name: "Signale.js", url: "https://klaudiosinani.com/software/signale/" },
    ],
};

describe("CollectionPageSchemaBuilder.build", () => {
    it("givenAListPage_whenBuilding_thenItIsACollectionPageAndNotAnArticle", () => {
        expect(underTest.build(details)["@type"]).toBe("CollectionPage");
        expect(underTest.build(details)["@context"]).toBe("https://schema.org");
    });

    it("givenEntries_whenBuilding_thenTheyKeepTheOrderOfThePage", () => {
        const list: {
            numberOfItems: number;
            itemListElement: { position: number; name: string }[];
        } = underTest.build(details).mainEntity as {
            numberOfItems: number;
            itemListElement: { position: number; name: string }[];
        };

        expect(list.numberOfItems).toBe(2);
        expect(list.itemListElement.map(({ position }: { position: number; name: string }) => position)).toEqual([
            1, 2,
        ]);
        expect(list.itemListElement[0].name).toBe("Taskbook");
    });

    it("givenNoEntry_whenBuilding_thenTheListIsEmptyRatherThanAbsent", () => {
        const list: { numberOfItems: number; itemListElement: unknown[] } = underTest.build({ ...details, items: [] })
            .mainEntity as {
            numberOfItems: number;
            itemListElement: unknown[];
        };

        expect(list.numberOfItems).toBe(0);
        expect(list.itemListElement).toEqual([]);
    });
});

describe("CollectionPageSchemaBuilder.build, with an author", () => {
    it("givenTheAuthorOfTheWork_whenBuilding_thenThePageNamesThatPerson", () => {
        const built: StructuredData = underTest.build({
            name: "Software",
            url: "https://klaudiosinani.com/software/",
            description: "Open source projects.",
            items: [],
            author: { name: "Klaudio Sinani", url: "https://klaudiosinani.com/" },
        });

        expect(built.author).toEqual({
            "@type": "Person",
            name: "Klaudio Sinani",
            url: "https://klaudiosinani.com/",
        });
    });

    it("givenTheNameOfThePersonRecord_whenBuilding_thenTheListPointsAtIt", () => {
        expect(
            underTest.build({
                name: "Software",
                url: "https://klaudiosinani.com/software/",
                description: "Open source projects.",
                items: [],
                author: {
                    name: "Klaudio Sinani",
                    url: "https://klaudiosinani.com/",
                    id: "https://klaudiosinani.com/#person",
                },
            }).author
        ).toEqual({
            "@type": "Person",
            "@id": "https://klaudiosinani.com/#person",
            name: "Klaudio Sinani",
            url: "https://klaudiosinani.com/",
        });
    });

    it("givenNoAuthor_whenBuilding_thenNoneIsClaimed", () => {
        expect(
            underTest.build({
                name: "Software",
                url: "https://klaudiosinani.com/software/",
                description: "Open source projects.",
                items: [],
            })
        ).not.toHaveProperty("author");
    });
});

describe("CollectionPageSchemaBuilder.build, stated in full", () => {
    const whole: {
        name: string;
        url: string;
        description: string;
        items: never[];
        image: string;
        inLanguage: string;
        siteId: string;
        dateModified: string;
    } = {
        name: "Software",
        url: "https://klaudiosinani.com/software/",
        description: "Open source projects.",
        items: [],
        image: "https://klaudiosinani.com/og/software.png",
        inLanguage: "en",
        siteId: "https://klaudiosinani.com/#website",
        dateModified: "2026-08-09T09:12:00Z",
    };

    it("givenAWholeList_whenBuilding_thenEveryFactIsCarried", () => {
        expect(underTest.build(whole)).toMatchObject({
            mainEntityOfPage: { "@type": "WebPage", "@id": whole.url },
            image: whole.image,
            inLanguage: "en",
            dateModified: whole.dateModified,
            isPartOf: { "@id": whole.siteId },
        });
    });

    it("givenNothingButTheList_whenBuilding_thenNoCardAndNoSiteAreClaimed", () => {
        const built: StructuredData = underTest.build({
            name: whole.name,
            url: whole.url,
            description: whole.description,
            items: [],
        });

        expect(built).not.toHaveProperty("image");
        expect(built).not.toHaveProperty("isPartOf");
        expect(built).not.toHaveProperty("inLanguage");
        expect(built).not.toHaveProperty("dateModified");
    });
});
