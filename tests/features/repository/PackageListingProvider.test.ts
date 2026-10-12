import { afterEach, describe, expect, it, vi } from "vitest";
import { PackageListingProvider } from "@app/feature/repository/service/PackageListingProvider";

import type { PackageListing } from "@app/feature/repository/PackageListing";
const underTest: PackageListingProvider = new PackageListingProvider();

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const notFound = (): Response => new Response("", { status: 404 });

const NPM: {
    "dist-tags": { latest: string };
    maintainers: { name: string }[];
} = {
    "dist-tags": { latest: "4.2.0" },
    maintainers: [{ name: "klaudiosinani" }],
};
const PYPI: { info: { version: string; project_urls: { Source: string } } } = {
    info: {
        version: "1.4.2",
        project_urls: { Source: "https://github.com/klaudiosinani/moviebox" },
    },
};
const SNAP: {
    "channel-map": { channel: { name: string }; version: string }[];
    snap: { publisher: { username: string } };
} = {
    "channel-map": [
        { channel: { name: "edge" }, version: "0.4.0" },
        { channel: { name: "stable" }, version: "0.3.0" },
    ],
    snap: { publisher: { username: "klaudiosinani" } },
};

const published = (payloads: Record<string, unknown>): void => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) => {
        const url: string = String(input);
        const matched: [string, unknown] | undefined = Object.entries(payloads).find(([host]: [string, unknown]) =>
            url.includes(host)
        );

        return Promise.resolve(matched ? jsonResponse(matched[1]) : notFound());
    });
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("PackageListingProvider.listings", () => {
    it("givenARepositoryOnNoRegistry_whenListing_thenNothingIsReturned", async () => {
        published({});

        const listings: PackageListing[] = await underTest.listings("operating-systems");

        expect(listings).toEqual([]);
    });

    it("givenAnNpmPackage_whenListing_thenTheLinkCarriesTheLatestVersion", async () => {
        published({ "registry.npmjs.org": NPM });

        const [listing] = await underTest.listings("signale");

        expect(listing.registry).toBe("npm");
        expect(listing.url).toBe("https://www.npmjs.com/package/signale");
        expect(listing.version).toBe("4.2.0");
    });

    it("givenAPypiPackage_whenListing_thenItsOwnVersionFieldIsRead", async () => {
        published({ "pypi.org": PYPI });

        const [listing] = await underTest.listings("moviebox");

        expect(listing.registry).toBe("pypi");
        expect(listing.url).toBe("https://pypi.org/project/moviebox/");
        expect(listing.version).toBe("1.4.2");
    });

    it("givenASnap_whenListing_thenTheStableChannelWinsOverEdge", async () => {
        published({ "api.snapcraft.io": SNAP });

        const [listing] = await underTest.listings("taskbook");

        expect(listing.registry).toBe("snapcraft");
        expect(listing.version).toBe("0.3.0");
    });

    it("givenASnapProbe_whenListing_thenTheSeriesHeaderTheApiDemandsIsSent", async () => {
        const headers: unknown[] = [];
        vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
            if (String(input).includes("api.snapcraft.io")) {
                headers.push(init?.headers);
                return Promise.resolve(jsonResponse(SNAP));
            }
            return Promise.resolve(notFound());
        });

        await underTest.listings("taskbook");

        expect(headers).toEqual([{ "Snap-Device-Series": "16" }]);
    });

    it("givenARegistryWithoutAVersion_whenListing_thenTheLinkStandsAlone", async () => {
        published({
            "registry.npmjs.org": { maintainers: [{ name: "klaudiosinani" }] },
        });

        const [listing] = await underTest.listings("signale");

        expect(listing.version).toBeNull();
    });

    it("givenAPypiPayloadWithoutAVersion_whenListing_thenTheLinkStandsAlone", async () => {
        published({
            "pypi.org": {
                info: { home_page: "https://github.com/klaudiosinani/moviebox" },
            },
        });

        const [listing] = await underTest.listings("moviebox");

        expect(listing.version).toBeNull();
    });

    it("givenASnapPublishedOnlyToEdge_whenListing_thenNoStableVersionIsClaimed", async () => {
        published({
            "api.snapcraft.io": {
                "channel-map": [{ channel: { name: "edge" }, version: "0.4.0" }],
                snap: { publisher: { username: "klaudiosinani" } },
            },
        });

        const [listing] = await underTest.listings("taskbook");

        expect(listing.registry).toBe("snapcraft");
        expect(listing.version).toBeNull();
    });

    it("givenAnNpmNamesakeOwnedBySomeoneElse_whenListing_thenItIsNotClaimed", async () => {
        published({
            "registry.npmjs.org": {
                "dist-tags": { latest: "9.9.9" },
                maintainers: [{ name: "jwalsh" }],
            },
        });

        const listings: PackageListing[] = await underTest.listings("ao");

        expect(listings).toEqual([]);
    });

    it("givenAPypiProjectPointingAtAnotherAccount_whenListing_thenItIsNotClaimed", async () => {
        published({
            "pypi.org": {
                info: {
                    version: "2.0.0",
                    project_urls: { Source: "https://github.com/someone-else/moviebox" },
                },
            },
        });

        const listings: PackageListing[] = await underTest.listings("moviebox");

        expect(listings).toEqual([]);
    });

    it("givenASnapFromAnotherPublisher_whenListing_thenItIsNotClaimed", async () => {
        published({
            "api.snapcraft.io": {
                "channel-map": [{ channel: { name: "stable" }, version: "1.0.0" }],
                snap: { publisher: { username: "somebody" } },
            },
        });

        const listings: PackageListing[] = await underTest.listings("taskbook");

        expect(listings).toEqual([]);
    });

    it("givenAFormerGitHubUsername_whenListing_thenThePackageIsStillRecognisedAsOurs", async () => {
        published({
            "pypi.org": {
                info: {
                    version: "1.0.0",
                    project_urls: { Source: "https://github.com/klaussinani/moviebox" },
                },
            },
        });

        const [listing] = await underTest.listings("moviebox");

        expect(listing.registry).toBe("pypi");
    });

    it("givenAnNpmPayloadStatingNoMaintainers_whenListing_thenItIsNotClaimed", async () => {
        published({ "registry.npmjs.org": { "dist-tags": { latest: "1.0.0" } } });

        const listings: PackageListing[] = await underTest.listings("signale");

        expect(listings).toEqual([]);
    });

    it("givenAPypiPayloadWithoutAnInfoBlock_whenListing_thenItIsNotClaimed", async () => {
        published({ "pypi.org": {} });

        const listings: PackageListing[] = await underTest.listings("moviebox");

        expect(listings).toEqual([]);
    });

    it("givenAnUnreachableRegistry_whenListing_thenItIsOmittedRatherThanFailingThePage", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

        const listings: PackageListing[] = await underTest.listings("signale");

        expect(listings).toEqual([]);
    });

    it("givenAPackageOnSeveralRegistries_whenListing_thenEachIsReturned", async () => {
        published({ "registry.npmjs.org": NPM, "api.snapcraft.io": SNAP });

        const listings: PackageListing[] = await underTest.listings("taskbook");

        expect(listings.map((listing: PackageListing) => listing.registry)).toEqual(["npm", "snapcraft"]);
    });
});

describe("PackageListingProvider when a registry answers with something else", () => {
    it("givenABodyThatIsNotJson_whenProbing_thenNoListingIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("<html>busy</html>", { status: 200 }));

        await expect(new PackageListingProvider().listings("signale")).resolves.toEqual([]);
    });
});
