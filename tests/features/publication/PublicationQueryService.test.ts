import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicationQueryService } from "@features/publication/PublicationQueryService";
import { SCHEDULED_POST_MARGIN } from "@config/content";
import { blogEntry } from "../../support/blogEntry";

const underTest = PublicationQueryService;

const NOW = new Date("2026-06-01T12:00:00Z");

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
    // given
    vi.stubEnv("DEV", true);
    const draft = blogEntry({ draft: true });

    // when
    const published = underTest.isPublished(draft);

    // then
    expect(published).toBe(false);
  });

  it("givenAFutureDatedPostInDevelopment_whenCheckingIfPublished_thenItIsVisible", () => {
    // given
    freezeClock(true);
    const futurePost = blogEntry({
      pubDatetime: new Date("2027-01-01T00:00:00Z"),
    });

    // when
    const published = underTest.isPublished(futurePost);

    // then
    expect(published).toBe(true);
  });

  it("givenAPastDatedPostInProduction_whenCheckingIfPublished_thenItIsVisible", () => {
    // given
    freezeClock(false);
    const publishedPost = blogEntry({
      pubDatetime: new Date("2026-01-01T00:00:00Z"),
    });

    // when
    const published = underTest.isPublished(publishedPost);

    // then
    expect(published).toBe(true);
  });

  it("givenAFutureDatedPostInProduction_whenCheckingIfPublished_thenItIsWithheld", () => {
    // given
    freezeClock(false);
    const futurePost = blogEntry({
      pubDatetime: new Date("2027-01-01T00:00:00Z"),
    });

    // when
    const published = underTest.isPublished(futurePost);

    // then
    expect(published).toBe(false);
  });

  it("givenAPostWithinTheSchedulingMargin_whenCheckingIfPublished_thenItIsVisible", () => {
    // given
    freezeClock(false);
    const withinMargin = blogEntry({
      pubDatetime: new Date(NOW.getTime() + SCHEDULED_POST_MARGIN - 60_000),
    });

    // when
    const published = underTest.isPublished(withinMargin);

    // then
    expect(published).toBe(true);
  });

  it("givenAPostBeyondTheSchedulingMargin_whenCheckingIfPublished_thenItIsWithheld", () => {
    // given
    freezeClock(false);
    const beyondMargin = blogEntry({
      pubDatetime: new Date(NOW.getTime() + SCHEDULED_POST_MARGIN + 60_000),
    });

    // when
    const published = underTest.isPublished(beyondMargin);

    // then
    expect(published).toBe(false);
  });
});

describe("PublicationQueryService.sortByDate", () => {
  it("givenUnorderedPosts_whenSortingByDate_thenTheNewestComesFirst", () => {
    // when
    const posts = underTest.sortByDate([
      blogEntry({ slug: "oldest", pubDatetime: new Date("2024-01-01") }),
      blogEntry({ slug: "newest", pubDatetime: new Date("2026-01-01") }),
      blogEntry({ slug: "middle", pubDatetime: new Date("2025-01-01") }),
    ]);

    // then
    expect(posts.map(({ slug }) => slug)).toEqual([
      "newest",
      "middle",
      "oldest",
    ]);
  });

  it("givenAnOlderPostThatWasUpdated_whenSortingByDate_thenItOutranksTheNewerOne", () => {
    // when
    const posts = underTest.sortByDate([
      blogEntry({ slug: "recent-pub", pubDatetime: new Date("2025-06-01") }),
      blogEntry({
        slug: "old-but-updated",
        pubDatetime: new Date("2024-01-01"),
        modDatetime: new Date("2026-01-01"),
      }),
    ]);

    // then
    expect(posts.map(({ slug }) => slug)).toEqual([
      "old-but-updated",
      "recent-pub",
    ]);
  });

  it("givenADraftAmongPublishedPosts_whenSortingByDate_thenTheDraftIsRemoved", () => {
    // when
    const posts = underTest.sortByDate([
      blogEntry({ slug: "draft", draft: true }),
      blogEntry({ slug: "published" }),
    ]);

    // then
    expect(posts.map(({ slug }) => slug)).toEqual(["published"]);
  });
});

describe("PublicationQueryService.findByTag", () => {
  it("givenPostsUnderDifferentTags_whenFindingByTag_thenOnlyItsOwnPostsAreReturned", () => {
    // when
    const posts = underTest.findByTag(
      [
        blogEntry({ slug: "tagged", tags: ["linux"] }),
        blogEntry({ slug: "other", tags: ["java"] }),
      ],
      "linux"
    );

    // then
    expect(posts.map(({ slug }) => slug)).toEqual(["tagged"]);
  });

  it("givenATagAuthoredInProse_whenFindingByItsSlug_thenThePostIsMatched", () => {
    // when
    const posts = underTest.findByTag(
      [blogEntry({ slug: "tagged", tags: ["Stream API"] })],
      "stream-api"
    );

    // then
    expect(posts.map(({ slug }) => slug)).toEqual(["tagged"]);
  });

  it("givenSeveralPostsSharingATag_whenFindingByTag_thenTheyAreSortedNewestFirst", () => {
    // when
    const posts = underTest.findByTag(
      [
        blogEntry({
          slug: "older",
          tags: ["linux"],
          pubDatetime: new Date("2024-01-01"),
        }),
        blogEntry({
          slug: "newer",
          tags: ["linux"],
          pubDatetime: new Date("2026-01-01"),
        }),
      ],
      "linux"
    );

    // then
    expect(posts.map(({ slug }) => slug)).toEqual(["newer", "older"]);
  });

  it("givenAnUnusedTag_whenFindingByTag_thenAnEmptyListIsReturned", () => {
    // when
    const posts = underTest.findByTag(
      [blogEntry({ tags: ["linux"] })],
      "gnome"
    );

    // then
    expect(posts).toEqual([]);
  });
});

describe("PublicationQueryService.collectTags", () => {
  it("givenATagSharedByTwoPosts_whenCollectingTags_thenItAppearsOnce", () => {
    // when
    const tags = underTest.collectTags([
      blogEntry({ slug: "a", tags: ["linux", "gnome"] }),
      blogEntry({ slug: "b", tags: ["linux", "python"] }),
    ]);

    // then
    expect(tags.map(({ tag }) => tag)).toEqual(["gnome", "linux", "python"]);
  });

  it("givenTheSameTagAuthoredTwoWays_whenCollectingTags_thenTheyCollapseIntoOne", () => {
    // when
    const tags = underTest.collectTags([
      blogEntry({ slug: "a", tags: ["Stream API"] }),
      blogEntry({ slug: "b", tags: ["stream-api"] }),
    ]);

    // then
    expect(tags).toHaveLength(1);
    expect(tags[0].tag).toBe("stream-api");
  });

  it("givenATagWhoseDisplayFormDiffersFromItsSlug_whenCollectingTags_thenBothAreKept", () => {
    // when
    const tags = underTest.collectTags([blogEntry({ tags: ["Stream API"] })]);

    // then
    expect(tags[0]).toEqual({ tag: "stream-api", tagName: "Stream API" });
  });

  it("givenTagsAuthoredOutOfOrder_whenCollectingTags_thenTheyAreSortedBySlug", () => {
    // when
    const tags = underTest.collectTags([
      blogEntry({ tags: ["zebra", "alpha", "middle"] }),
    ]);

    // then
    expect(tags.map(({ tag }) => tag)).toEqual(["alpha", "middle", "zebra"]);
  });

  it("givenATagUsedOnlyByADraft_whenCollectingTags_thenItIsIgnored", () => {
    // when
    const tags = underTest.collectTags([
      blogEntry({ slug: "draft", draft: true, tags: ["hidden"] }),
      blogEntry({ slug: "published", tags: ["visible"] }),
    ]);

    // then
    expect(tags.map(({ tag }) => tag)).toEqual(["visible"]);
  });
});
