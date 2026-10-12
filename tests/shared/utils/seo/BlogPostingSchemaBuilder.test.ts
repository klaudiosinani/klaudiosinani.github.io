import { describe, expect, it } from "vitest";
import { BlogPostingSchemaBuilder } from "@app/util/seo/BlogPostingSchemaBuilder";
import type { StructuredData } from "@app/util/seo/StructuredData";

const underTest: typeof BlogPostingSchemaBuilder = BlogPostingSchemaBuilder;

const details: {
    headline: string;
    image: string;
    author: string;
    profile: string;
    pubDatetime: Date;
} = {
    headline: "A Post - Klaudio Sinani",
    image: "https://klaudiosinani.com/header.jpeg",
    author: "Klaudio Sinani",
    profile: "https://klaudiosinani.com/",
    pubDatetime: new Date("2026-01-02T03:04:05Z"),
};

describe("BlogPostingSchemaBuilder.build", () => {
    it("givenAPublishedPost_whenBuildingTheSchema_thenASchemaOrgBlogPostingIsDeclared", () => {
        const schema: StructuredData = underTest.build(details);

        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBe("BlogPosting");
    });

    it("givenAPublishedPost_whenBuildingTheSchema_thenTheHeadlineAndImageAreCarriedThrough", () => {
        const schema: StructuredData = underTest.build(details);

        expect(schema.headline).toBe(details.headline);
        expect(schema.image).toBe(details.image);
    });

    it("givenAPublishedPost_whenBuildingTheSchema_thenTheDateIsIso8601", () => {
        const schema: StructuredData = underTest.build(details);

        expect(schema.datePublished).toBe("2026-01-02T03:04:05.000Z");
    });

    it("givenAPostNeverModified_whenBuildingTheSchema_thenDateModifiedIsOmitted", () => {
        const neverModified: {
            modDatetime: null;
            headline: string;
            image: string;
            author: string;
            profile: string;
            pubDatetime: Date;
        } = { ...details, modDatetime: null };

        const implicit: StructuredData = underTest.build(details);
        const explicit: StructuredData = underTest.build(neverModified);

        expect(implicit).not.toHaveProperty("dateModified");
        expect(explicit).not.toHaveProperty("dateModified");
    });

    it("givenAModifiedPost_whenBuildingTheSchema_thenDateModifiedIsIncluded", () => {
        const modified: {
            modDatetime: Date;
            headline: string;
            image: string;
            author: string;
            profile: string;
            pubDatetime: Date;
        } = {
            ...details,
            modDatetime: new Date("2026-02-03T04:05:06Z"),
        };

        const schema: StructuredData = underTest.build(modified);

        expect(schema.dateModified).toBe("2026-02-03T04:05:06.000Z");
    });

    it("givenAPublishedPost_whenBuildingTheSchema_thenItIsAttributedToTheAuthorProfile", () => {
        const schema: StructuredData = underTest.build(details);

        expect(schema.author).toEqual([{ "@type": "Person", name: details.author, url: details.profile }]);
    });

    it("givenAPageWithoutAPublicationDate_whenBuildingTheSchema_thenTheExistingOutputIsPreserved", () => {
        const undated: {
            pubDatetime: undefined;
            headline: string;
            image: string;
            author: string;
            profile: string;
        } = { ...details, pubDatetime: undefined };

        const schema: StructuredData = underTest.build(undated);

        expect(schema.datePublished).toBe("undefined");
    });
});

describe("BlogPostingSchemaBuilder.build, stated in full", () => {
    const whole: Parameters<typeof BlogPostingSchemaBuilder.build>[0] = {
        headline: "Singlie: v3.0.0 Release",
        image: "https://klaudiosinani.com/publications/singlie.png",
        author: "Klaudio Sinani",
        profile: "https://klaudiosinani.com/",
        pubDatetime: new Date("2025-11-09T18:36:27Z"),
        modDatetime: null,
        description: "A complete TypeScript rewrite of the linked list library.",
        url: "https://klaudiosinani.com/publications/singlie-v3-0-0-release/",
        keywords: ["typescript", "release"],
        wordCount: 1_240,
        inLanguage: "en",
    };

    it("givenAnArticleStatedInFull_whenBuilding_thenEveryFactIsCarried", () => {
        expect(underTest.build(whole)).toMatchObject({
            description: whole.description,
            url: whole.url,
            keywords: ["typescript", "release"],
            wordCount: 1_240,
            inLanguage: "en",
            mainEntityOfPage: { "@type": "WebPage", "@id": whole.url },
        });
    });

    it("givenAPersonalSite_whenBuilding_thenTheAuthorIsAlsoThePublisher", () => {
        expect(underTest.build(whole).publisher).toEqual({
            "@type": "Person",
            name: "Klaudio Sinani",
            url: "https://klaudiosinani.com/",
        });
    });

    it("givenNoSubjectsAndNoLength_whenBuilding_thenNeitherIsClaimed", () => {
        const built: StructuredData = underTest.build({
            ...whole,
            keywords: [],
            wordCount: 0,
        });

        expect(built).not.toHaveProperty("keywords");
        expect(built).not.toHaveProperty("wordCount");
    });

    it("givenNoAddress_whenBuilding_thenNoPageIsNamed", () => {
        const built: StructuredData = underTest.build({ ...whole, url: undefined });

        expect(built).not.toHaveProperty("url");
        expect(built).not.toHaveProperty("mainEntityOfPage");
    });
});

describe("BlogPostingSchemaBuilder.build, joined to the person", () => {
    it("givenTheNameOfThePersonRecord_whenBuilding_thenTheArticlePointsAtIt", () => {
        const built: StructuredData = underTest.build({
            ...details,
            authorId: "https://klaudiosinani.com/#person",
        });

        expect(built.author).toEqual([
            {
                "@type": "Person",
                "@id": "https://klaudiosinani.com/#person",
                name: "Klaudio Sinani",
                url: "https://klaudiosinani.com/",
            },
        ]);
        expect(built.publisher).toMatchObject({
            "@id": "https://klaudiosinani.com/#person",
        });
    });
});
