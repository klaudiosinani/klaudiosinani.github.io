import { describe, expect, it } from "vitest";
import { SchemaIdentifiers } from "@app/util/seo/SchemaIdentifiers";

const underTest: typeof SchemaIdentifiers = SchemaIdentifiers;

const SITE: string = "https://klaudiosinani.com/";

describe("SchemaIdentifiers", () => {
    it("givenTheSite_whenNamingThePerson_thenTheNameIsAnAnchorOfTheHomePage", () => {
        expect(underTest.person(SITE)).toBe("https://klaudiosinani.com/#person");
    });

    it("givenTheSite_whenNamingTheSiteRecord_thenItIsAnAnchorOfTheSamePage", () => {
        expect(underTest.website(SITE)).toBe("https://klaudiosinani.com/#website");
    });

    it("givenTheTwoRecords_whenNamed_thenNoTwoRecordsShareAName", () => {
        expect(underTest.person(SITE)).not.toBe(underTest.website(SITE));
    });
});
