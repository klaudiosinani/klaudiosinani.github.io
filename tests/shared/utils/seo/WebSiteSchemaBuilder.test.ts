import { describe, expect, it } from "vitest";
import { WebSiteSchemaBuilder } from "@app/util/seo/WebSiteSchemaBuilder";

import type { StructuredData } from "@app/util/seo/StructuredData";
const underTest: typeof WebSiteSchemaBuilder = WebSiteSchemaBuilder;

const details: { name: string; url: string; description: string } = {
    name: "Klaudio Sinani",
    url: "https://klaudiosinani.com/",
    description: "Open source software.",
};

describe("WebSiteSchemaBuilder.build", () => {
    it("givenASite_whenBuilding_thenTheTypeIsWebSite", () => {
        expect(underTest.build(details)).toMatchObject({
            "@context": "https://schema.org",
            "@type": "WebSite",
        });
    });

    it("givenASearchPage_whenBuilding_thenTheActionCarriesTheQueryTemplate", () => {
        const built: StructuredData = underTest.build({
            ...details,
            searchUrl: "https://klaudiosinani.com/search/?q={query}",
        });

        expect(built.potentialAction).toMatchObject({
            "@type": "SearchAction",
            "query-input": "required name=query",
        });
    });

    it("givenNoSearchPage_whenBuilding_thenNoActionIsClaimed", () => {
        expect(underTest.build(details)).not.toHaveProperty("potentialAction");
    });
});

describe("WebSiteSchemaBuilder.build, joined to the person", () => {
    const details: {
        name: string;
        url: string;
        description: string;
        id: string;
        publisherId: string;
        inLanguage: string;
    } = {
        name: "Klaudio Sinani",
        url: "https://klaudiosinani.com/",
        description: "Open source software.",
        id: "https://klaudiosinani.com/#website",
        publisherId: "https://klaudiosinani.com/#person",
        inLanguage: "en",
    };

    it("givenThePersonBehindTheSite_whenBuilding_thenTheSiteNamesThatRecord", () => {
        expect(underTest.build(details)).toMatchObject({
            "@id": "https://klaudiosinani.com/#website",
            inLanguage: "en",
            publisher: { "@id": "https://klaudiosinani.com/#person" },
        });
    });

    it("givenNoPersonAndNoName_whenBuilding_thenNeitherIsClaimed", () => {
        const built: StructuredData = underTest.build({
            name: details.name,
            url: details.url,
            description: details.description,
        });

        expect(built).not.toHaveProperty("publisher");
        expect(built).not.toHaveProperty("@id");
        expect(built).not.toHaveProperty("inLanguage");
    });
});
