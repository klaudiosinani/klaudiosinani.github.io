import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCollection } from "astro:content";
import { ContentRetrievalService } from "@services/content/ContentRetrievalService";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const getCollectionMock = vi.mocked(getCollection);

interface OrderedEntryFixture {
  id: string;
  data: {
    title: string;
    order: number;
    draft?: boolean;
  };
}

const entry = (
  id: string,
  order: number,
  draft?: boolean
): OrderedEntryFixture => ({
  id,
  data:
    draft === undefined ? { title: id, order } : { title: id, order, draft },
});

const underTest = new ContentRetrievalService();

beforeEach(() => {
  getCollectionMock.mockReset();
});

describe("ContentRetrievalService.entries", () => {
  it("givenAnEmptyCollection_whenRetrievingEntries_thenItIsRequestedOnce", async () => {
    // given
    getCollectionMock.mockResolvedValue([]);

    // when
    await underTest.entries("about");

    // then
    expect(getCollectionMock).toHaveBeenCalledExactlyOnceWith("about");
  });

  it("givenUnorderedEntries_whenRetrievingEntries_thenTheyAreSortedByOrder", async () => {
    // given
    getCollectionMock.mockResolvedValue([
      entry("third", 3),
      entry("first", 1),
      entry("second", 2),
    ] as never);

    // when
    const entries = await underTest.entries("about");

    // then
    expect(entries.map(({ id }) => id)).toEqual(["first", "second", "third"]);
  });

  it("givenADraftAmongPublishedEntries_whenRetrievingEntries_thenTheDraftIsRemoved", async () => {
    // given
    getCollectionMock.mockResolvedValue([
      entry("published", 1, false),
      entry("draft", 2, true),
    ] as never);

    // when
    const entries = await underTest.entries("about");

    // then
    expect(entries.map(({ id }) => id)).toEqual(["published"]);
  });

  it("givenASchemaWithoutADraftField_whenRetrievingEntries_thenTheEntryIsKept", async () => {
    // given
    getCollectionMock.mockResolvedValue([entry("no-draft-field", 1)] as never);

    // when
    const entries = await underTest.entries("about");

    // then
    expect(entries.map(({ id }) => id)).toEqual(["no-draft-field"]);
  });

  it("givenAPublishedEntry_whenRetrievingEntries_thenTheEntryItselfIsReturned", async () => {
    // given
    const published = entry("published", 1);
    getCollectionMock.mockResolvedValue([published] as never);

    // when
    const entries = await underTest.entries("about");

    // then
    expect(entries[0]).toBe(published);
  });
});

describe("ContentRetrievalService.data", () => {
  it("givenUnorderedAndDraftEntries_whenRetrievingData_thenOnlyPublishedFrontmatterIsReturnedInOrder", async () => {
    // given
    getCollectionMock.mockResolvedValue([
      entry("second", 2),
      entry("draft", 3, true),
      entry("first", 1),
    ] as never);

    // when
    const data = await underTest.data("about");

    // then
    expect(data).toEqual([
      { title: "first", order: 1 },
      { title: "second", order: 2 },
    ]);
  });
});

describe("ContentRetrievalService.renderedSections", () => {
  const renderable = (id: string, order: number, draft?: boolean) => ({
    ...entry(id, order, draft),
    render: vi.fn().mockResolvedValue({ Content: `<${id}/>` }),
  });

  it("givenARenderableEntry_whenRetrievingRenderedSections_thenItsTitleAndBodyArePaired", async () => {
    // given
    getCollectionMock.mockResolvedValue([renderable("intro", 1)] as never);

    // when & then
    await expect(underTest.renderedSections("about")).resolves.toEqual([
      { title: "intro", Content: "<intro/>" },
    ]);
  });

  it("givenUnorderedRenderableEntries_whenRetrievingRenderedSections_thenTheOrderIsPreserved", async () => {
    // given
    getCollectionMock.mockResolvedValue([
      renderable("second", 2),
      renderable("first", 1),
    ] as never);

    // when
    const sections = await underTest.renderedSections("about");

    // then
    expect(sections.map(({ title }) => title)).toEqual(["first", "second"]);
  });

  it("givenADraftAmongRenderableEntries_whenRetrievingRenderedSections_thenTheDraftIsSkipped", async () => {
    // given
    getCollectionMock.mockResolvedValue([
      renderable("draft", 1, true),
      renderable("published", 2),
    ] as never);

    // when
    const sections = await underTest.renderedSections("about");

    // then
    expect(sections.map(({ title }) => title)).toEqual(["published"]);
  });
});
