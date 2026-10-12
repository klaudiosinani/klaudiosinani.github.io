import type { CollectionEntry } from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MockedFunction } from "vitest";
import { getCollection, render } from "astro:content";
import { ContentRetrievalService } from "@app/infrastructure/content/service/ContentRetrievalService";
import type { RenderedSection } from "@app/infrastructure/content/domain/RenderedSection";

vi.mock("astro:content", () => ({
    getCollection: vi.fn(),
    render: vi.fn(),
}));

const getCollectionMock: MockedFunction<typeof getCollection> = vi.mocked(getCollection);

const renderMock: MockedFunction<typeof render> = vi.mocked(render);

interface OrderedEntryFixture {
    id: string;
    data: {
        title: string;
        order: number;
        draft?: boolean;
    };
}

const entry = (id: string, order: number, draft?: boolean): OrderedEntryFixture => ({
    id,
    data: draft === undefined ? { title: id, order } : { title: id, order, draft },
});

const underTest: ContentRetrievalService = new ContentRetrievalService();

beforeEach(() => {
    getCollectionMock.mockReset();
});

describe("ContentRetrievalService.entries", () => {
    it("givenAnEmptyCollection_whenRetrievingEntries_thenItIsRequestedOnce", async () => {
        getCollectionMock.mockResolvedValue([]);

        await underTest.entries("about");

        expect(getCollectionMock).toHaveBeenCalledExactlyOnceWith("about");
    });

    it("givenUnorderedEntries_whenRetrievingEntries_thenTheyAreSortedByOrder", async () => {
        getCollectionMock.mockResolvedValue([entry("third", 3), entry("first", 1), entry("second", 2)] as never);

        const entries: CollectionEntry<"about">[] = await underTest.entries("about");

        expect(entries.map(({ id }: CollectionEntry<"about">) => id)).toEqual(["first", "second", "third"]);
    });

    it("givenADraftAmongPublishedEntries_whenRetrievingEntries_thenTheDraftIsRemoved", async () => {
        getCollectionMock.mockResolvedValue([entry("published", 1, false), entry("draft", 2, true)] as never);

        const entries: CollectionEntry<"about">[] = await underTest.entries("about");

        expect(entries.map(({ id }: CollectionEntry<"about">) => id)).toEqual(["published"]);
    });

    it("givenASchemaWithoutADraftField_whenRetrievingEntries_thenTheEntryIsKept", async () => {
        getCollectionMock.mockResolvedValue([entry("no-draft-field", 1)] as never);

        const entries: CollectionEntry<"about">[] = await underTest.entries("about");

        expect(entries.map(({ id }: CollectionEntry<"about">) => id)).toEqual(["no-draft-field"]);
    });

    it("givenAPublishedEntry_whenRetrievingEntries_thenTheEntryItselfIsReturned", async () => {
        const published: OrderedEntryFixture = entry("published", 1);
        getCollectionMock.mockResolvedValue([published] as never);

        const entries: CollectionEntry<"about">[] = await underTest.entries("about");

        expect(entries[0]).toBe(published);
    });
});

describe("ContentRetrievalService.data", () => {
    it("givenUnorderedAndDraftEntries_whenRetrievingData_thenOnlyPublishedFrontmatterIsReturnedInOrder", async () => {
        getCollectionMock.mockResolvedValue([entry("second", 2), entry("draft", 3, true), entry("first", 1)] as never);

        const data: {
            title: string;
            draft: boolean;
            order: number;
            href?: string | undefined;
        }[] = await underTest.data("about");

        expect(data).toEqual([
            { title: "first", order: 1 },
            { title: "second", order: 2 },
        ]);
    });
});

describe("ContentRetrievalService.renderedSections", () => {
    const renderable = (id: string, order: number, draft?: boolean): OrderedEntryFixture => entry(id, order, draft);

    beforeEach(() => {
        renderMock.mockReset();
        renderMock.mockImplementation(({ id }: { id: string }) => Promise.resolve({ Content: `<${id}/>` }) as never);
    });

    it("givenARenderableEntry_whenRetrievingRenderedSections_thenItsTitleAndBodyArePaired", async () => {
        getCollectionMock.mockResolvedValue([renderable("intro", 1)] as never);

        await expect(underTest.renderedSections("about")).resolves.toEqual([{ title: "intro", Content: "<intro/>" }]);
    });

    it("givenUnorderedRenderableEntries_whenRetrievingRenderedSections_thenTheOrderIsPreserved", async () => {
        getCollectionMock.mockResolvedValue([renderable("second", 2), renderable("first", 1)] as never);

        const sections: RenderedSection[] = await underTest.renderedSections("about");

        expect(sections.map(({ title }: RenderedSection) => title)).toEqual(["first", "second"]);
    });

    it("givenADraftAmongRenderableEntries_whenRetrievingRenderedSections_thenTheDraftIsSkipped", async () => {
        getCollectionMock.mockResolvedValue([renderable("draft", 1, true), renderable("published", 2)] as never);

        const sections: RenderedSection[] = await underTest.renderedSections("about");

        expect(sections.map(({ title }: RenderedSection) => title)).toEqual(["published"]);
    });

    it("givenASectionThatStatesAnAddress_whenRetrievingRenderedSections_thenTheAddressIsCarried", async () => {
        getCollectionMock.mockResolvedValue([
            {
                ...renderable("software", 1),
                data: { title: "software", order: 1, href: "/software/" },
            },
        ] as never);

        await expect(underTest.renderedSections("about")).resolves.toEqual([
            { title: "software", Content: "<software/>", href: "/software/" },
        ]);
    });
});
