import { describe, expect, it } from "vitest";
import { RepositoryLicenseResolver } from "@app/feature/repository/service/RepositoryLicenseResolver";

const underTest: typeof RepositoryLicenseResolver = RepositoryLicenseResolver;

describe("RepositoryLicenseResolver.resolve", () => {
    it("givenAnIdentifiedLicence_whenResolving_thenItPointsAtTheSpdxPage", () => {
        expect(underTest.resolve("MIT")).toBe("https://spdx.org/licenses/MIT.html");
    });

    it("givenAnIdentifierWithAVersion_whenResolving_thenItIsKeptWhole", () => {
        expect(underTest.resolve("Apache-2.0")).toBe("https://spdx.org/licenses/Apache-2.0.html");
    });

    it("givenALicenceStatedInWords_whenResolving_thenNoPageIsClaimed", () => {
        expect(underTest.resolve("Custom terms")).toBeNull();
    });

    it("givenNoLicence_whenResolving_thenNothingIsReturned", () => {
        expect(underTest.resolve(null)).toBeNull();
    });
});
