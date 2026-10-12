import { describe, expect, it } from "vitest";
import { BREADCRUMB_HOME } from "@app/configuration/BreadcrumbHome";
import { SITE } from "@app/configuration/Site";

const underTest: string = BREADCRUMB_HOME;

describe("BREADCRUMB_HOME", () => {
    it("givenTheFirstStep_whenRead_thenItSaysWhereTheLinkGoes", () => {
        expect(underTest).toBe("Home");
    });

    it("givenTheFirstStep_whenCompared_thenItIsNotTheNameOfTheSite", () => {
        expect(underTest).not.toBe(SITE.title);
    });
});
