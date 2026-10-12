import { describe, expect, it } from "vitest";
import { PaginationService } from "@app/feature/pagination/service/PaginationService";
import type { PaginatedResult } from "@app/feature/pagination/PaginatedResult";

const items = (count: number): number[] => Array.from({ length: count }, (_: unknown, index: number) => index + 1);

const underTest: PaginationService = new PaginationService(5);

describe("PaginationService.paginate", () => {
    it("givenAnIndexRoute_whenPaginating_thenTheFirstPageIsServed", () => {
        const options: { items: number[]; basePath: string; isIndex: boolean } = {
            items: items(12),
            basePath: "/publications",
            isIndex: true,
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result).toEqual({
            currentPage: 1,
            totalPages: 3,
            totalItems: 12,
            items: [1, 2, 3, 4, 5],
            hasPrevious: false,
            hasNext: true,
            prevUrl: "",
            nextUrl: "/publications/2/",
        });
    });

    it("givenAnIndexRouteWithAPageNumber_whenPaginating_thenTheFirstPageIsForced", () => {
        const options: {
            items: number[];
            page: number;
            basePath: string;
            isIndex: boolean;
        } = {
            items: items(12),
            page: 3,
            basePath: "/publications",
            isIndex: true,
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.currentPage).toBe(1);
    });

    it("givenAMiddlePage_whenPaginating_thenBothNeighbourLinksAreSet", () => {
        const options: { items: number[]; page: number; basePath: string } = {
            items: items(12),
            page: 2,
            basePath: "/software/all",
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result).toEqual({
            currentPage: 2,
            totalPages: 3,
            totalItems: 12,
            items: [6, 7, 8, 9, 10],
            hasPrevious: true,
            hasNext: true,
            prevUrl: "/software/all/",
            nextUrl: "/software/all/3/",
        });
    });

    it("givenTheSecondPage_whenPaginating_thenThePreviousLinkIsTheBasePath", () => {
        const options: { items: number[]; page: number; basePath: string } = {
            items: items(12),
            page: 2,
            basePath: "/publications",
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.prevUrl).toBe("/publications/");
    });

    it("givenTheLastPage_whenPaginating_thenThePreviousLinkIsNumberedAndThereIsNoNext", () => {
        const options: { items: number[]; page: number; basePath: string } = {
            items: items(12),
            page: 3,
            basePath: "/publications",
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.prevUrl).toBe("/publications/2/");
        expect(result.nextUrl).toBe("");
        expect(result.getItems()).toEqual([11, 12]);
    });

    it("givenAStringPageParameter_whenPaginating_thenItIsParsedAsANumber", () => {
        const options: { items: number[]; page: string; basePath: string } = {
            items: items(12),
            page: "2",
            basePath: "/publications",
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.currentPage).toBe(2);
    });

    it("givenANonNumericPage_whenPaginating_thenTheFirstPageIsServed", () => {
        const options: { items: number[]; page: string; basePath: string } = {
            items: items(12),
            page: "not-a-number",
            basePath: "/publications",
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.currentPage).toBe(1);
    });

    it("givenNoPage_whenPaginating_thenTheFirstPageIsServed", () => {
        const options: { items: number[]; basePath: string } = {
            items: items(12),
            basePath: "/publications",
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.currentPage).toBe(1);
    });

    it("givenAPageBeyondTheLast_whenPaginating_thenItIsClampedToTheLastPage", () => {
        const options: { items: number[]; page: number; basePath: string } = {
            items: items(12),
            page: 99,
            basePath: "/publications",
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.currentPage).toBe(3);
    });

    it("givenAPageBelowTheFirst_whenPaginating_thenItIsClampedToTheFirstPage", () => {
        const options: { items: number[]; page: number; basePath: string } = {
            items: items(12),
            page: 0,
            basePath: "/publications",
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.currentPage).toBe(1);
    });

    it("givenAnEmptyList_whenPaginating_thenASingleEmptyPageIsReported", () => {
        const options: { items: never[]; basePath: string } = {
            items: [],
            basePath: "/publications",
        };

        const result: PaginatedResult<never> = underTest.paginate(options);

        expect(result).toEqual({
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            items: [],
            hasPrevious: false,
            hasNext: false,
            prevUrl: "",
            nextUrl: "",
        });
    });

    it("givenASinglePageOfItems_whenPaginating_thenBothLinksAreDisabled", () => {
        const options: { items: number[]; basePath: string } = {
            items: items(3),
            basePath: "/publications",
        };

        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.totalPages).toBe(1);
        expect(result.prevUrl).toBe("");
        expect(result.nextUrl).toBe("");
    });

    it("givenACustomPageSize_whenPaginating_thenThatSizeIsUsed", () => {
        const options: { items: number[]; page: number; basePath: string } = {
            items: items(5),
            page: 3,
            basePath: "/publications",
        };

        const underTest: PaginationService = new PaginationService(2);
        const result: PaginatedResult<number> = underTest.paginate(options);

        expect(result.totalPages).toBe(3);
        expect(result.getItems()).toEqual([5]);
    });
});

describe("PaginationService.pageNumbers", () => {
    it("givenNoItems_whenListingPageNumbers_thenASinglePageIsReturned", () => {
        const pages: number[] = underTest.pageNumbers(0);

        expect(pages).toEqual([1]);
    });

    it("givenAnExactMultipleOfThePageSize_whenListingPageNumbers_thenNoTrailingPageIsAdded", () => {
        const pages: number[] = underTest.pageNumbers(10);

        expect(pages).toEqual([1, 2]);
    });

    it("givenARemainder_whenListingPageNumbers_thenAnExtraPageIsAdded", () => {
        const pages: number[] = underTest.pageNumbers(11);

        expect(pages).toEqual([1, 2, 3]);
    });
});

describe("PaginationService.subsequentPageNumbers", () => {
    it("givenSeveralPages_whenListingSubsequentPageNumbers_thenPageOneIsOmitted", () => {
        const pages: number[] = underTest.subsequentPageNumbers(12);

        expect(pages).toEqual([2, 3]);
    });

    it("givenASinglePageOfItems_whenListingSubsequentPageNumbers_thenNothingIsReturned", () => {
        const pages: number[] = underTest.subsequentPageNumbers(5);

        expect(pages).toEqual([]);
    });

    it("givenAnEmptyCollection_whenListingSubsequentPageNumbers_thenNothingIsReturned", () => {
        const pages: number[] = underTest.subsequentPageNumbers(0);

        expect(pages).toEqual([]);
    });

    it("givenTheOnlyPage_whenPaginating_thenNeitherWayLeadsAnywhere", () => {
        const result: PaginatedResult<number> = underTest.paginate({
            items: items(3),
            basePath: "/publications",
        });

        expect(result.hasPrevious).toBe(false);
        expect(result.hasNext).toBe(false);
    });

    it("givenTheLastPage_whenPaginating_thenOnlyTheWayBackLeadsAnywhere", () => {
        const result: PaginatedResult<number> = underTest.paginate({
            items: items(12),
            page: 3,
            basePath: "/publications",
        });

        expect(result.hasPrevious).toBe(true);
        expect(result.hasNext).toBe(false);
    });
});
