import { describe, expect, it } from "vitest";
import { PersonSchemaBuilder } from "@app/util/seo/PersonSchemaBuilder";

import type { StructuredData } from "@app/util/seo/StructuredData";
const underTest: typeof PersonSchemaBuilder = PersonSchemaBuilder;

const details: {
    name: string;
    url: string;
    description: string;
    sameAs: string[];
    jobTitle: string;
} = {
    name: "Klaudio Sinani",
    url: "https://klaudiosinani.com/",
    description: "Open source software.",
    sameAs: ["https://github.com/klaudiosinani"],
    jobTitle: "Software Engineer",
};

describe("PersonSchemaBuilder.build", () => {
    it("givenAPerson_whenBuilding_thenTheTypeAndContextAreCorrect", () => {
        expect(underTest.build(details)).toMatchObject({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Klaudio Sinani",
        });
    });

    it("givenProfilesOnOtherSites_whenBuilding_thenTheyAreListedAsTheSamePerson", () => {
        expect(underTest.build(details).sameAs).toEqual(["https://github.com/klaudiosinani"]);
    });

    it("givenNoProfiles_whenBuilding_thenTheFieldIsLeftOut", () => {
        expect(underTest.build({ ...details, sameAs: [] })).not.toHaveProperty("sameAs");
    });

    it("givenNoJobTitle_whenBuilding_thenTheFieldIsLeftOut", () => {
        expect(underTest.build({ ...details, jobTitle: undefined })).not.toHaveProperty("jobTitle");
    });
});

describe("PersonSchemaBuilder.build, stated in full", () => {
    const whole: Parameters<typeof PersonSchemaBuilder.build>[0] = {
        name: "Klaudio Sinani",
        url: "https://klaudiosinani.com/",
        description: "A software engineer.",
        sameAs: ["https://github.com/klaudiosinani"],
        jobTitle: "Staff Software Engineer",
        id: "https://klaudiosinani.com/#person",
        givenName: "Klaudio",
        familyName: "Sinani",
        alternateName: "klaudiosinani",
        knowsAbout: ["Software Engineering", "Developer Tools"],
        image: "https://klaudiosinani.com/og.png",
    };

    it("givenTheFieldsOfTheWork_whenBuilding_thenTheyAreStatedAsKnowledge", () => {
        expect(underTest.build(whole).knowsAbout).toEqual(["Software Engineering", "Developer Tools"]);
    });

    it("givenTheWholeRecord_whenBuilding_thenEveryPartOfTheNameIsCarried", () => {
        expect(underTest.build(whole)).toMatchObject({
            "@id": "https://klaudiosinani.com/#person",
            givenName: "Klaudio",
            familyName: "Sinani",
            alternateName: "klaudiosinani",
            image: "https://klaudiosinani.com/og.png",
        });
    });

    it("givenNoFieldsAndNoName_whenBuilding_thenNoneOfThemIsClaimed", () => {
        const built: StructuredData = underTest.build({
            name: whole.name,
            url: whole.url,
            description: whole.description,
            sameAs: [],
        });

        expect(built).not.toHaveProperty("knowsAbout");
        expect(built).not.toHaveProperty("givenName");
        expect(built).not.toHaveProperty("@id");
        expect(built).not.toHaveProperty("image");
        expect(built).not.toHaveProperty("alternateName");
    });
});

describe("PersonSchemaBuilder.build, with an employer", () => {
    const details: {
        name: string;
        url: string;
        description: string;
        sameAs: never[];
    } = {
        name: "Klaudio Sinani",
        url: "https://klaudiosinani.com/",
        description: "A software engineer.",
        sameAs: [],
    };

    it("givenTheEmployerOfToday_whenBuilding_thenThePersonIsJoinedToThatOrganisation", () => {
        expect(
            underTest.build({
                ...details,
                worksFor: { name: "UBS", url: "https://www.ubs.com/" },
            }).worksFor
        ).toEqual({
            "@type": "Organization",
            name: "UBS",
            url: "https://www.ubs.com/",
        });
    });

    it("givenAnEmployerWithNoAddress_whenBuilding_thenOnlyTheNameIsStated", () => {
        expect(underTest.build({ ...details, worksFor: { name: "UBS" } }).worksFor).toEqual({
            "@type": "Organization",
            name: "UBS",
        });
    });

    it("givenNoEmployer_whenBuilding_thenNoneIsClaimed", () => {
        expect(underTest.build(details)).not.toHaveProperty("worksFor");
    });
});

describe("PersonSchemaBuilder.reference", () => {
    it("givenTheNameOfTheRecord_whenReferencing_thenThePersonIsStatedInShort", () => {
        expect(
            underTest.reference({
                id: "https://klaudiosinani.com/#person",
                name: "Klaudio Sinani",
                url: "https://klaudiosinani.com/",
            })
        ).toEqual({
            "@type": "Person",
            "@id": "https://klaudiosinani.com/#person",
            name: "Klaudio Sinani",
            url: "https://klaudiosinani.com/",
        });
    });
});
