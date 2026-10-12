import { describe, expect, it } from "vitest";
import { AUTHOR_NAME } from "@app/configuration/AuthorName";
import type { AuthorName } from "@app/configuration/AuthorName";
import { SITE } from "@app/configuration/Site";

const underTest: AuthorName = AUTHOR_NAME;

describe("AUTHOR_NAME", () => {
    it("givenTheTwoParts_whenJoined_thenTheyAreTheNameTheSiteCarries", () => {
        expect(`${underTest.given} ${underTest.family}`).toBe(SITE.author);
    });
});
