import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MockedFunction } from "vitest";
import { getCollection } from "astro:content";
import { FeaturedPressRetrievalService } from "@app/feature/press/service/FeaturedPressRetrievalService";
import type { FeaturedPress } from "@app/feature/press/FeaturedPress";

const underTest: FeaturedPressRetrievalService = new FeaturedPressRetrievalService();

vi.mock("astro:content", () => ({
    getCollection: vi.fn(),
}));

const getCollectionMock: MockedFunction<typeof getCollection> = vi.mocked(getCollection);

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
        getCollectionMock.mockResolvedValue([]);

        await underTest.retrieve();

        expect(getCollectionMock).toHaveBeenCalledExactlyOnceWith("press");
    });

    it("givenUnorderedEntries_whenRetrievingFeaturedPress_thenTheirFrontmatterIsReturnedInOrder", async () => {
        getCollectionMock.mockResolvedValue([entry("Second Article", 2), entry("First Article", 1)] as never);

        const press: FeaturedPress[] = await underTest.retrieve();

        expect(press.map(({ publicationTitle }: FeaturedPress) => publicationTitle)).toEqual([
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
