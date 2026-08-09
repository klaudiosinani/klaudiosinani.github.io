import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCollection } from "astro:content";
import { FeaturedPressRetrievalService } from "@features/press/FeaturedPressRetrievalService";

const underTest = new FeaturedPressRetrievalService();

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const getCollectionMock = vi.mocked(getCollection);

const entry = (publicationTitle: string, order: number) => ({
  id: `${order}.md`,
  data: {
    publicationTitle,
    issueNumber: "01/2026",
    publisherName: "Publisher",
    publicationUrl: "https://example.com/article",
    softwareTitle: "Software",
    softwareRepositoryUrl: "https://github.com/user/software",
    hidden: false,
    order,
  },
});

beforeEach(() => {
  getCollectionMock.mockReset();
});

describe("FeaturedPressRetrievalService.retrieve", () => {
  it("givenAnEmptyCollection_whenRetrievingFeaturedPress_thenThePressCollectionIsRequestedOnce", async () => {
    // given
    getCollectionMock.mockResolvedValue([]);

    // when
    await underTest.retrieve();

    // then
    expect(getCollectionMock).toHaveBeenCalledExactlyOnceWith("press");
  });

  it("givenUnorderedEntries_whenRetrievingFeaturedPress_thenTheirFrontmatterIsReturnedInOrder", async () => {
    // given
    getCollectionMock.mockResolvedValue([
      entry("Second Article", 2),
      entry("First Article", 1),
    ] as never);

    // when
    const press = await underTest.retrieve();

    // then
    expect(press.map(({ publicationTitle }) => publicationTitle)).toEqual([
      "First Article",
      "Second Article",
    ]);
    expect(press[0]).toEqual({
      publicationTitle: "First Article",
      issueNumber: "01/2026",
      publisherName: "Publisher",
      publicationUrl: "https://example.com/article",
      softwareTitle: "Software",
      softwareRepositoryUrl: "https://github.com/user/software",
      hidden: false,
      order: 1,
    });
  });
});
