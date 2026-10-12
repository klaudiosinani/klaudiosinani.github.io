import { describe, expect, it } from "vitest";
import { RepositoryLinkFactory } from "@app/feature/repository/factory/RepositoryLinkFactory";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";

import type { RepositoryLink } from "@app/feature/repository/RepositoryLink";
const underTest: typeof RepositoryLinkFactory = RepositoryLinkFactory;

const profile = (overrides: Partial<RepositoryProfile> = {}): RepositoryProfile => ({
    slug: "signale",
    name: "Signale.js",
    logline: "",
    description: "",
    url: "https://github.com/klaudiosinani/signale",
    language: "JavaScript",
    license: "MIT",
    topics: [],
    createdAt: "2017-10-01T00:00:00Z",
    stars: 9179,
    forks: 231,
    downloads: { total: null, sources: [], caveats: [] },
    trend: [],
    starHistory: [],
    releases: [],
    totals: null,
    packages: [
        {
            registry: "npm",
            label: "npm",
            url: "https://www.npmjs.com/package/signale",
            version: "4.2.0",
        },
    ],
    latestCommit: null,
    languages: [],
    contributors: null,
    clones: null,
    dependents: { repositories: 154_518, packages: 1_907, notable: [] },
    manual: null,
    documents: [],
    citation: null,
    ...overrides,
});

const labels = (links: { label: string }[]): string[] => links.map(({ label }: { label: string }) => label);

describe("RepositoryLinkFactory.create", () => {
    it("givenAProfile_whenListing_thenTheSourceComesFirst", () => {
        const [first] = underTest.create(profile());

        expect(first.label).toBe("GitHub");
        expect(first.href).toBe("https://github.com/klaudiosinani/signale");
    });

    it("givenADestination_whenListing_thenItCarriesTheMarkThePageDrawsItWith", () => {
        for (const link of underTest.create(profile())) {
            expect(link.icon).toBeTypeOf("function");
        }
    });

    it("givenAPublishedPackage_whenListing_thenItIsNamedAndAddressed", () => {
        const [, registry] = underTest.create(profile());

        expect(registry.label).toBe("npm");
        expect(registry.href).toBe("https://www.npmjs.com/package/signale");
    });

    it("givenARegistry_whenListing_thenItCarriesTheColourThatServiceUses", () => {
        const [, registry] = underTest.create(profile());

        expect(registry.color).toBe("#CB3837");
    });

    it("givenTheSource_whenListing_thenItStatesNoColourOfItsOwn", () => {
        const [first] = underTest.create(profile());

        expect(first.color).toBeNull();
    });

    it("givenEveryRegistryTheSiteReads_whenListing_thenEachOneHasAColour", () => {
        const listed: RepositoryLink[] = underTest.create(
            profile({
                packages: [
                    {
                        registry: "snapcraft",
                        label: "Snap",
                        url: "https://snapcraft.io/signale",
                        version: null,
                    },
                    {
                        registry: "pypi",
                        label: "PyPI",
                        url: "https://pypi.org/project/signale/",
                        version: "1.0.0",
                    },
                ],
            })
        );

        expect(listed.slice(1).map(({ color }: RepositoryLink) => color)).toEqual(["#82BEA6", "#3775A9"]);
    });

    it("givenADependentCount_whenListing_thenNoCellShowsIt", () => {
        expect(labels(underTest.create(profile()))).toEqual(["GitHub", "npm"]);
    });

    it("givenAProjectOnNoRegistry_whenListing_thenOnlyTheSourceIsNamed", () => {
        expect(labels(underTest.create(profile({ packages: [] })))).toEqual(["GitHub"]);
    });
});
