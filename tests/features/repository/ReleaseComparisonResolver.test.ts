import { describe, expect, it } from "vitest";
import { ReleaseComparisonResolver } from "@app/feature/repository/service/ReleaseComparisonResolver";

const underTest: typeof ReleaseComparisonResolver = ReleaseComparisonResolver;

describe("ReleaseComparisonResolver.resolve", () => {
    it("givenTwoReleases_whenResolving_thenTheAddressComparesTheOlderWithTheNewer", () => {
        expect(underTest.resolve("https://github.com/klaudiosinani/signale", "v4.1.0", "v4.2.0")).toBe(
            "https://github.com/klaudiosinani/signale/compare/v4.1.0...v4.2.0"
        );
    });

    it("givenAnAddressThatEndsWithASeparator_whenResolving_thenItIsNotDoubled", () => {
        expect(underTest.resolve("https://github.com/klaudiosinani/qoa/", "v1.0.0", "v2.0.0")).toBe(
            "https://github.com/klaudiosinani/qoa/compare/v1.0.0...v2.0.0"
        );
    });
});
