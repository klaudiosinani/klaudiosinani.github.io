import type { CollectionEntry } from "astro:content";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicationQueryService } from "@app/feature/publication/service/PublicationQueryService";
import { PublicationConfiguration } from "@app/feature/publication/PublicationConfiguration";
import { blogEntry } from "../../support/BlogEntry";
import type { Tag } from "@app/feature/publication/Tag";

const underTest: typeof PublicationQueryService = PublicationQueryService;

const NOW: Date = new Date("2026-06-01T12:00:00Z");

afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
});

const freezeClock = (isDev: boolean): void => {
    vi.stubEnv("DEV", isDev);
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
};

describe("PublicationQueryService.isPublished", () => {
    it("givenADraft_whenCheckingIfPublished_thenItIsHiddenEvenInDevelopment", () => {
        vi.stubEnv("DEV", true);
        const draft: CollectionEntry<"blog"> = blogEntry({ draft: true });

        const published: boolean = underTest.isPublished(draft);

        expect(published).toBe(false);
    });

    it("givenAFutureDatedPostInDevelopment_whenCheckingIfPublished_thenItIsVisible", () => {
        freezeClock(true);
        const futurePost: CollectionEntry<"blog"> = blogEntry({
            pubDatetime: new Date("2027-01-01T00:00:00Z"),
        });

        const published: boolean = underTest.isPublished(futurePost);

        expect(published).toBe(true);
    });

    it("givenAPastDatedPostInProduction_whenCheckingIfPublished_thenItIsVisible", () => {
        freezeClock(false);
        const publishedPost: CollectionEntry<"blog"> = blogEntry({
            pubDatetime: new Date("2026-01-01T00:00:00Z"),
        });

        const published: boolean = underTest.isPublished(publishedPost);

        expect(published).toBe(true);
    });

    it("givenAFutureDatedPostInProduction_whenCheckingIfPublished_thenItIsWithheld", () => {
        freezeClock(false);
        const futurePost: CollectionEntry<"blog"> = blogEntry({
            pubDatetime: new Date("2027-01-01T00:00:00Z"),
        });

        const published: boolean = underTest.isPublished(futurePost);

        expect(published).toBe(false);
    });

    it("givenAPostWithinTheSchedulingMargin_whenCheckingIfPublished_thenItIsVisible", () => {
        freezeClock(false);
        const withinMargin: CollectionEntry<"blog"> = blogEntry({
            pubDatetime: new Date(NOW.getTime() + PublicationConfiguration.SCHEDULED_MARGIN - 60_000),
        });

        const published: boolean = underTest.isPublished(withinMargin);

        expect(published).toBe(true);
    });

    it("givenAPostBeyondTheSchedulingMargin_whenCheckingIfPublished_thenItIsWithheld", () => {
        freezeClock(false);
        const beyondMargin: CollectionEntry<"blog"> = blogEntry({
            pubDatetime: new Date(NOW.getTime() + PublicationConfiguration.SCHEDULED_MARGIN + 60_000),
        });

        const published: boolean = underTest.isPublished(beyondMargin);

        expect(published).toBe(false);
    });
});

describe("PublicationQueryService.sortByDate", () => {
    it("givenUnorderedPosts_whenSortingByDate_thenTheNewestComesFirst", () => {
        const posts: CollectionEntry<"blog">[] = underTest.sortByDate([
            blogEntry({ id: "oldest", pubDatetime: new Date("2024-01-01") }),
            blogEntry({ id: "newest", pubDatetime: new Date("2026-01-01") }),
            blogEntry({ id: "middle", pubDatetime: new Date("2025-01-01") }),
        ]);

        expect(posts.map(({ id }: CollectionEntry<"blog">) => id)).toEqual(["newest", "middle", "oldest"]);
    });

    it("givenAnOlderPostThatWasUpdated_whenSortingByDate_thenItOutranksTheNewerOne", () => {
        const posts: CollectionEntry<"blog">[] = underTest.sortByDate([
            blogEntry({ id: "recent-pub", pubDatetime: new Date("2025-06-01") }),
            blogEntry({
                id: "old-but-updated",
                pubDatetime: new Date("2024-01-01"),
                modDatetime: new Date("2026-01-01"),
            }),
        ]);

        expect(posts.map(({ id }: CollectionEntry<"blog">) => id)).toEqual(["old-but-updated", "recent-pub"]);
    });

    it("givenADraftAmongPublishedPosts_whenSortingByDate_thenTheDraftIsRemoved", () => {
        const posts: CollectionEntry<"blog">[] = underTest.sortByDate([
            blogEntry({ id: "draft", draft: true }),
            blogEntry({ id: "published" }),
        ]);

        expect(posts.map(({ id }: CollectionEntry<"blog">) => id)).toEqual(["published"]);
    });
});

describe("PublicationQueryService.findByTag", () => {
    it("givenPostsUnderDifferentTags_whenFindingByTag_thenOnlyItsOwnPostsAreReturned", () => {
        const posts: CollectionEntry<"blog">[] = underTest.findByTag(
            [blogEntry({ id: "tagged", tags: ["linux"] }), blogEntry({ id: "other", tags: ["java"] })],
            "linux"
        );

        expect(posts.map(({ id }: CollectionEntry<"blog">) => id)).toEqual(["tagged"]);
    });

    it("givenATagAuthoredInProse_whenFindingByItsSlug_thenThePostIsMatched", () => {
        const posts: CollectionEntry<"blog">[] = underTest.findByTag(
            [blogEntry({ id: "tagged", tags: ["Stream API"] })],
            "stream-api"
        );

        expect(posts.map(({ id }: CollectionEntry<"blog">) => id)).toEqual(["tagged"]);
    });

    it("givenSeveralPostsSharingATag_whenFindingByTag_thenTheyAreSortedNewestFirst", () => {
        const posts: CollectionEntry<"blog">[] = underTest.findByTag(
            [
                blogEntry({
                    id: "older",
                    tags: ["linux"],
                    pubDatetime: new Date("2024-01-01"),
                }),
                blogEntry({
                    id: "newer",
                    tags: ["linux"],
                    pubDatetime: new Date("2026-01-01"),
                }),
            ],
            "linux"
        );

        expect(posts.map(({ id }: CollectionEntry<"blog">) => id)).toEqual(["newer", "older"]);
    });

    it("givenAnUnusedTag_whenFindingByTag_thenAnEmptyListIsReturned", () => {
        const posts: CollectionEntry<"blog">[] = underTest.findByTag([blogEntry({ tags: ["linux"] })], "gnome");

        expect(posts).toEqual([]);
    });
});

describe("PublicationQueryService.collectTags", () => {
    it("givenATagSharedByTwoPosts_whenCollectingTags_thenItAppearsOnce", () => {
        const tags: Tag[] = underTest.collectTags([
            blogEntry({ id: "a", tags: ["linux", "gnome"] }),
            blogEntry({ id: "b", tags: ["linux", "python"] }),
        ]);

        expect(tags.map(({ tag }: Tag) => tag)).toEqual(["gnome", "linux", "python"]);
    });

    it("givenTheSameTagAuthoredTwoWays_whenCollectingTags_thenTheyCollapseIntoOne", () => {
        const tags: Tag[] = underTest.collectTags([
            blogEntry({ id: "a", tags: ["Stream API"] }),
            blogEntry({ id: "b", tags: ["stream-api"] }),
        ]);

        expect(tags).toHaveLength(1);
        expect(tags[0].tag).toBe("stream-api");
    });

    it("givenATagWhoseDisplayFormDiffersFromItsSlug_whenCollectingTags_thenBothAreKept", () => {
        const tags: Tag[] = underTest.collectTags([blogEntry({ tags: ["Stream API"] })]);

        expect(tags[0]).toEqual({
            tag: "stream-api",
            tagName: "Stream API",
            count: 1,
        });
    });

    it("givenATagOnSeveralArticles_whenCollectingTags_thenItStatesHowMany", () => {
        const tags: Tag[] = underTest.collectTags([
            blogEntry({ id: "a", tags: ["linux"] }),
            blogEntry({ id: "b", tags: ["linux"] }),
            blogEntry({ id: "c", tags: ["gnome"] }),
        ]);

        expect(tags.map(({ tag, count }: Tag) => `${tag}:${count}`)).toEqual(["gnome:1", "linux:2"]);
    });

    it("givenTagsAuthoredOutOfOrder_whenCollectingTags_thenTheyAreSortedBySlug", () => {
        const tags: Tag[] = underTest.collectTags([blogEntry({ tags: ["zebra", "alpha", "middle"] })]);

        expect(tags.map(({ tag }: Tag) => tag)).toEqual(["alpha", "middle", "zebra"]);
    });

    it("givenATagUsedOnlyByADraft_whenCollectingTags_thenItIsIgnored", () => {
        const tags: Tag[] = underTest.collectTags([
            blogEntry({ id: "draft", draft: true, tags: ["hidden"] }),
            blogEntry({ id: "published", tags: ["visible"] }),
        ]);

        expect(tags.map(({ tag }: Tag) => tag)).toEqual(["visible"]);
    });
});
