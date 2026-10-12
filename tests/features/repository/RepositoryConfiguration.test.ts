import { describe, expect, it } from "vitest";
import { RepositoryConfiguration } from "@app/feature/repository/RepositoryConfiguration";

const underTest: typeof RepositoryConfiguration = RepositoryConfiguration;

describe("RepositoryConfiguration.profiles", () => {
    it("givenAnOrdinaryRepository_whenAsked_thenItGetsAPage", () => {
        expect(underTest.profiles("signale")).toBe(true);
        expect(underTest.profiles("hyper-pokemon")).toBe(true);
    });

    it("givenARepositoryNamedForAnExistingRoute_whenAsked_thenItIsRefused", () => {
        for (const route of [
            "about",
            "press",
            "publications",
            "search",
            "software",
            "activity",
            "thanks",
            "index",
            "all",
            "releases",
            "404",
        ]) {
            expect(underTest.profiles(route)).toBe(false);
        }
    });

    it("givenARepositoryNamedForAFileTheHostServes_whenAsked_thenItIsRefused", () => {
        expect(underTest.profiles("rss")).toBe(false);
        expect(underTest.profiles("robots")).toBe(false);
        expect(underTest.profiles("sitemap")).toBe(false);
        expect(underTest.profiles("og")).toBe(false);
    });

    it("givenADifferentlyCasedCollision_whenAsked_thenItIsStillRefused", () => {
        expect(underTest.profiles("All")).toBe(false);
    });
});

describe("RepositoryConfiguration.profiles, a name with a full stop", () => {
    it("givenARepositoryNamedWithAFullStop_whenAsked_thenItIsRefused", () => {
        expect(underTest.profiles(".github")).toBe(false);
        expect(underTest.profiles("klaudiosinani.github.io")).toBe(false);
    });
});
