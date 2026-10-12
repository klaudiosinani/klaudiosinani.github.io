import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import { blogEntry } from "../../support/BlogEntry";
import { PublicationNeighbourResolver } from "@app/feature/publication/service/PublicationNeighbourResolver";
import type { PublicationNeighbours } from "@app/feature/publication/PublicationNeighbours";

const underTest: typeof PublicationNeighbourResolver = PublicationNeighbourResolver;

const NEWEST: CollectionEntry<"blog"> = blogEntry({ id: "newest" });
const MIDDLE: CollectionEntry<"blog"> = blogEntry({ id: "middle" });
const OLDEST: CollectionEntry<"blog"> = blogEntry({ id: "oldest" });

const SORTED: CollectionEntry<"blog">[] = [NEWEST, MIDDLE, OLDEST];

describe("PublicationNeighbourResolver.resolve", () => {
    it("givenAnArticleInTheMiddle_whenResolving_thenBothNeighboursAreGiven", () => {
        const neighbours: PublicationNeighbours = underTest.resolve(MIDDLE, SORTED);

        expect(neighbours.newer?.id).toBe("newest");
        expect(neighbours.older?.id).toBe("oldest");
    });

    it("givenTheNewestArticle_whenResolving_thenNothingIsNewer", () => {
        expect(underTest.resolve(NEWEST, SORTED).newer).toBeNull();
    });

    it("givenTheOldestArticle_whenResolving_thenNothingIsOlder", () => {
        expect(underTest.resolve(OLDEST, SORTED).older).toBeNull();
    });

    it("givenAnArticleThatIsNotInTheList_whenResolving_thenNeitherIsClaimed", () => {
        const neighbours: PublicationNeighbours = underTest.resolve(blogEntry({ id: "elsewhere" }), SORTED);

        expect(neighbours).toEqual({ newer: null, older: null });
    });
});
