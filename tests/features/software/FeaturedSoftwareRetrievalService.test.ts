import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCollection } from "astro:content";
import { FeaturedSoftwareRetrievalService } from "@features/software/FeaturedSoftwareRetrievalService";

const underTest = new FeaturedSoftwareRetrievalService();

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const getCollectionMock = vi.mocked(getCollection);

const entry = (name: string, order: number) => ({
  id: `${name}.md`,
  data: {
    name,
    logline: `${name} logline`,
    metadata: "JavaScript",
    description: `${name} description`,
    url: `https://github.com/user/${name}`,
    order,
  },
});

beforeEach(() => {
  getCollectionMock.mockReset();
});

describe("FeaturedSoftwareRetrievalService.retrieve", () => {
  it("givenAnEmptyCollection_whenRetrievingFeaturedSoftware_thenTheSoftwareCollectionIsRequestedOnce", async () => {
    // given
    getCollectionMock.mockResolvedValue([]);

    // when
    await underTest.retrieve();

    // then
    expect(getCollectionMock).toHaveBeenCalledExactlyOnceWith("software");
  });

  it("givenUnorderedEntries_whenRetrievingFeaturedSoftware_thenTheirFrontmatterIsReturnedInOrder", async () => {
    // given
    getCollectionMock.mockResolvedValue([
      entry("second", 2),
      entry("first", 1),
    ] as never);

    // when
    const software = await underTest.retrieve();

    // then
    expect(software.map(({ name }) => name)).toEqual(["first", "second"]);
    expect(software[0]).toEqual({
      name: "first",
      logline: "first logline",
      metadata: "JavaScript",
      description: "first description",
      url: "https://github.com/user/first",
      order: 1,
    });
  });
});
