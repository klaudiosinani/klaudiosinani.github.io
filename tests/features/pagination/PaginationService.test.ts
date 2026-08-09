import { describe, expect, it } from "vitest";
import { PaginationService } from "@features/pagination/PaginationService";

const items = (count: number): number[] =>
  Array.from({ length: count }, (_, index) => index + 1);

const underTest = new PaginationService(5);

describe("PaginationService.paginate", () => {
  it("givenAnIndexRoute_whenPaginating_thenTheFirstPageIsServed", () => {
    // given
    const options = {
      items: items(12),
      basePath: "/publications",
      isIndex: true,
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result).toEqual({
      currentPage: 1,
      totalPages: 3,
      totalItems: 12,
      items: [1, 2, 3, 4, 5],
      prevUrl: "",
      nextUrl: "/publications/2/",
    });
  });

  it("givenAnIndexRouteWithAPageNumber_whenPaginating_thenTheFirstPageIsForced", () => {
    // given
    const options = {
      items: items(12),
      page: 3,
      basePath: "/publications",
      isIndex: true,
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result.currentPage).toBe(1);
  });

  it("givenAMiddlePage_whenPaginating_thenBothNeighbourLinksAreSet", () => {
    // given
    const options = {
      items: items(12),
      page: 2,
      basePath: "/software/all",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result).toEqual({
      currentPage: 2,
      totalPages: 3,
      totalItems: 12,
      items: [6, 7, 8, 9, 10],
      prevUrl: "/software/all/",
      nextUrl: "/software/all/3/",
    });
  });

  it("givenTheSecondPage_whenPaginating_thenThePreviousLinkIsTheBasePath", () => {
    // given
    const options = {
      items: items(12),
      page: 2,
      basePath: "/publications",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result.prevUrl).toBe("/publications/");
  });

  it("givenTheLastPage_whenPaginating_thenThePreviousLinkIsNumberedAndThereIsNoNext", () => {
    // given
    const options = {
      items: items(12),
      page: 3,
      basePath: "/publications",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result.prevUrl).toBe("/publications/2/");
    expect(result.nextUrl).toBe("");
    expect(result.items).toEqual([11, 12]);
  });

  it("givenAStringPageParameter_whenPaginating_thenItIsParsedAsANumber", () => {
    // given
    const options = {
      items: items(12),
      page: "2",
      basePath: "/publications",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result.currentPage).toBe(2);
  });

  it("givenANonNumericPage_whenPaginating_thenTheFirstPageIsServed", () => {
    // given
    const options = {
      items: items(12),
      page: "not-a-number",
      basePath: "/publications",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result.currentPage).toBe(1);
  });

  it("givenNoPage_whenPaginating_thenTheFirstPageIsServed", () => {
    // given
    const options = {
      items: items(12),
      basePath: "/publications",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result.currentPage).toBe(1);
  });

  it("givenAPageBeyondTheLast_whenPaginating_thenItIsClampedToTheLastPage", () => {
    // given
    const options = {
      items: items(12),
      page: 99,
      basePath: "/publications",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result.currentPage).toBe(3);
  });

  it("givenAPageBelowTheFirst_whenPaginating_thenItIsClampedToTheFirstPage", () => {
    // given
    const options = {
      items: items(12),
      page: 0,
      basePath: "/publications",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result.currentPage).toBe(1);
  });

  it("givenAnEmptyList_whenPaginating_thenASingleEmptyPageIsReported", () => {
    // given
    const options = {
      items: [],
      basePath: "/publications",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      items: [],
      prevUrl: "",
      nextUrl: "",
    });
  });

  it("givenASinglePageOfItems_whenPaginating_thenBothLinksAreDisabled", () => {
    // given
    const options = {
      items: items(3),
      basePath: "/publications",
    };

    // when
    const result = underTest.paginate(options);

    // then
    expect(result.totalPages).toBe(1);
    expect(result.prevUrl).toBe("");
    expect(result.nextUrl).toBe("");
  });

  it("givenACustomPageSize_whenPaginating_thenThatSizeIsUsed", () => {
    // given
    const options = {
      items: items(5),
      page: 3,
      basePath: "/publications",
    };

    // when
    const underTest = new PaginationService(2);
    const result = underTest.paginate(options);

    // then
    expect(result.totalPages).toBe(3);
    expect(result.items).toEqual([5]);
  });
});

describe("PaginationService.pageNumbers", () => {
  it("givenNoItems_whenListingPageNumbers_thenASinglePageIsReturned", () => {
    // when
    const pages = underTest.pageNumbers(0);

    // then
    expect(pages).toEqual([1]);
  });

  it("givenAnExactMultipleOfThePageSize_whenListingPageNumbers_thenNoTrailingPageIsAdded", () => {
    // when
    const pages = underTest.pageNumbers(10);

    // then
    expect(pages).toEqual([1, 2]);
  });

  it("givenARemainder_whenListingPageNumbers_thenAnExtraPageIsAdded", () => {
    // when
    const pages = underTest.pageNumbers(11);

    // then
    expect(pages).toEqual([1, 2, 3]);
  });
});

describe("PaginationService.subsequentPageNumbers", () => {
  it("givenSeveralPages_whenListingSubsequentPageNumbers_thenPageOneIsOmitted", () => {
    // when
    const pages = underTest.subsequentPageNumbers(12);

    // then
    expect(pages).toEqual([2, 3]);
  });

  it("givenASinglePageOfItems_whenListingSubsequentPageNumbers_thenNothingIsReturned", () => {
    // when
    const pages = underTest.subsequentPageNumbers(5);

    // then
    expect(pages).toEqual([]);
  });

  it("givenAnEmptyCollection_whenListingSubsequentPageNumbers_thenNothingIsReturned", () => {
    // when
    const pages = underTest.subsequentPageNumbers(0);

    // then
    expect(pages).toEqual([]);
  });
});
