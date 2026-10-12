import { describe, expect, it } from "vitest";
import { AUTHOR_JOB_TITLE } from "@app/configuration/AuthorJobTitle";
import { PAGE_DESCRIPTIONS } from "@app/configuration/PageDescriptions";

const underTest: string = AUTHOR_JOB_TITLE;

describe("AUTHOR_JOB_TITLE", () => {
    it("givenTheTitle_whenComparedWithTheAboutPage_thenTheTwoStateTheSameWork", () => {
        expect(PAGE_DESCRIPTIONS.about.toLowerCase()).toContain(underTest.toLowerCase());
    });
});
