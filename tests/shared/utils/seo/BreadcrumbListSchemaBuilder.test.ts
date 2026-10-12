import { describe, expect, it } from "vitest";
import { BreadcrumbListSchemaBuilder } from "@app/util/seo/BreadcrumbListSchemaBuilder";

import type { StructuredData } from "@app/util/seo/StructuredData";
const underTest: typeof BreadcrumbListSchemaBuilder = BreadcrumbListSchemaBuilder;

describe("BreadcrumbListSchemaBuilder.build", () => {
    it("givenATrail_whenBuilding_thenEachStepIsNumberedFromOne", () => {
        const built: StructuredData = underTest.build([
            { name: "Home", url: "https://example.com/" },
            { name: "Software", url: "https://example.com/software/" },
        ]);

        expect(built.itemListElement).toEqual([
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://example.com/",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Software",
                item: "https://example.com/software/",
            },
        ]);
    });

    it("givenNoSteps_whenBuilding_thenTheListIsEmpty", () => {
        expect(underTest.build([]).itemListElement).toEqual([]);
    });
});
