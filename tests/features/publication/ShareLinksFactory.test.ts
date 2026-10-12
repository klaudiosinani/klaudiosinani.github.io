import { describe, expect, it } from "vitest";
import type { ShareLink } from "@app/feature/publication/ShareLink";
import { ShareLinksFactory } from "@app/feature/publication/factory/ShareLinksFactory";

const underTest: typeof ShareLinksFactory = ShareLinksFactory;

const ADDRESS: string = "https://klaudiosinani.com/publications/streams/";

describe("ShareLinksFactory.create", () => {
    it("givenAnArticle_whenBuilding_thenEachNetworkIsOffered", () => {
        expect(underTest.create("Java Stream API", ADDRESS).map(({ name }: ShareLink) => name)).toEqual([
            "Bluesky",
            "Mastodon",
            "X",
            "Hacker News",
        ]);
    });

    it("givenATitleWithSpaces_whenBuilding_thenTheAddressIsEncoded", () => {
        for (const { name, href } of underTest.create("A B", ADDRESS)) {
            expect(href, name).not.toContain(" ");
        }
    });

    it("givenAnArticle_whenBuilding_thenEachAddressCarriesTheArticle", () => {
        for (const { name, href } of underTest.create("Streams", ADDRESS)) {
            expect(decodeURIComponent(href), name).toContain(ADDRESS);
        }
    });

    it("givenAnArticle_whenBuilding_thenEveryAddressIsOnItsOwnNetwork", () => {
        const hosts: string[] = underTest
            .create("Streams", ADDRESS)
            .map(({ href }: ShareLink) => new URL(href).hostname);

        expect(hosts).toEqual(["bsky.app", "mastodon.social", "x.com", "news.ycombinator.com"]);
    });
});
