import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MockedFunction } from "vitest";
import { getCollection } from "astro:content";
import { FeaturedSoftwareRetrievalService } from "@app/feature/software/service/FeaturedSoftwareRetrievalService";
import type { FeaturedSoftware } from "@app/feature/software/FeaturedSoftware";

const underTest: FeaturedSoftwareRetrievalService = new FeaturedSoftwareRetrievalService();

vi.mock("astro:content", () => ({
    getCollection: vi.fn(),
}));

const getCollectionMock: MockedFunction<typeof getCollection> = vi.mocked(getCollection);

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
        getCollectionMock.mockResolvedValue([]);

        await underTest.retrieve();

        expect(getCollectionMock).toHaveBeenCalledExactlyOnceWith("software");
    });

    it("givenUnorderedEntries_whenRetrievingFeaturedSoftware_thenTheirFrontmatterIsReturnedInOrder", async () => {
        getCollectionMock.mockResolvedValue([entry("second", 2), entry("first", 1)] as never);

        const software: FeaturedSoftware[] = await underTest.retrieve();

        expect(software.map(({ name }: FeaturedSoftware) => name)).toEqual(["first", "second"]);
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
