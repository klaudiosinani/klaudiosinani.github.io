import { describe, expect, it } from "vitest";
import { ProfilePageSchemaBuilder } from "@app/util/seo/ProfilePageSchemaBuilder";

import type { StructuredData } from "@app/util/seo/StructuredData";
const underTest: typeof ProfilePageSchemaBuilder = ProfilePageSchemaBuilder;

const person: { "@type": string; name: string } = {
    "@type": "Person",
    name: "Klaudio Sinani",
};

describe("ProfilePageSchemaBuilder.build", () => {
    it("givenTheAboutPage_whenBuilding_thenItIsMarkedAsTheProfile", () => {
        const schema: StructuredData = underTest.build({
            url: "https://klaudiosinani.com/about/",
            person,
        });

        expect(schema["@type"]).toBe("ProfilePage");
        expect(schema.url).toBe("https://klaudiosinani.com/about/");
    });

    it("givenAPerson_whenBuilding_thenThePersonIsTheSubjectOfThePage", () => {
        expect(underTest.build({ url: "https://klaudiosinani.com/about/", person }).mainEntity).toBe(person);
    });
});

describe("ProfilePageSchemaBuilder.build, joined to the site", () => {
    it("givenTheSiteAndTheName_whenBuilding_thenTheProfileStatesBoth", () => {
        const built: StructuredData = underTest.build({
            url: "https://klaudiosinani.com/about/",
            person: { "@type": "Person", name: "Klaudio Sinani" },
            name: "About Klaudio Sinani",
            siteId: "https://klaudiosinani.com/#website",
            inLanguage: "en",
        });

        expect(built).toMatchObject({
            name: "About Klaudio Sinani",
            inLanguage: "en",
            isPartOf: { "@id": "https://klaudiosinani.com/#website" },
        });
    });

    it("givenNothingButThePerson_whenBuilding_thenNoSiteIsClaimed", () => {
        expect(
            underTest.build({
                url: "https://klaudiosinani.com/about/",
                person: { "@type": "Person", name: "Klaudio Sinani" },
            })
        ).not.toHaveProperty("isPartOf");
    });
});
