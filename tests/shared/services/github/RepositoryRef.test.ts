import { describe, expect, it } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";

const underTest: RepositoryRef = new RepositoryRef("klaudiosinani", "signale");

describe("RepositoryRef", () => {
    it("givenAnAccountAndAName_whenTheRefIsRead_thenItStatesThePathOfTheRequest", () => {
        expect(underTest.path).toBe("klaudiosinani/signale");
    });

    it("givenARef_whenRead_thenItStatesTheAccountThatHoldsTheRepository", () => {
        expect(underTest.owner).toBe("klaudiosinani");
    });

    it("givenARef_whenRead_thenItStatesTheNameThatTheSiteServesItUnder", () => {
        expect(underTest.slug).toBe("signale");
    });
});
