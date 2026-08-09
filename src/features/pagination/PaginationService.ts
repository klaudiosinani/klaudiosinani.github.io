import { ITEMS_PER_PAGE } from "@config/content";
import type { PaginatedResult } from "./PaginatedResult";
import type { PaginationOptions } from "./PaginationOptions";

export class PaginationService {
  private static readonly FIRST_PAGE = 1;

  private readonly itemsPerPage: number;

  constructor(itemsPerPage: number = ITEMS_PER_PAGE) {
    this.itemsPerPage = itemsPerPage;
  }

  public paginate<T>({
    items,
    page,
    basePath,
    isIndex = false,
  }: PaginationOptions<T>): PaginatedResult<T> {
    const totalItems = items.length;
    const totalPages = this.countPages(totalItems);
    const currentPage = isIndex
      ? PaginationService.FIRST_PAGE
      : this.normalizePage(page, totalPages);

    const startIndex =
      (currentPage - PaginationService.FIRST_PAGE) * this.itemsPerPage;

    return {
      currentPage,
      totalPages,
      totalItems,
      items: items.slice(startIndex, startIndex + this.itemsPerPage),
      prevUrl: this.buildPreviousUrl(basePath, currentPage),
      nextUrl: this.buildNextUrl(basePath, currentPage, totalPages),
    };
  }

  public pageNumbers(itemCount: number): number[] {
    return Array.from(
      { length: this.countPages(itemCount) },
      (_, index) => index + PaginationService.FIRST_PAGE
    );
  }

  public subsequentPageNumbers(itemCount: number): number[] {
    return this.pageNumbers(itemCount).filter(
      pageNumber => pageNumber > PaginationService.FIRST_PAGE
    );
  }

  private countPages(itemCount: number): number {
    return Math.max(
      PaginationService.FIRST_PAGE,
      Math.ceil(itemCount / this.itemsPerPage)
    );
  }

  private normalizePage(
    page: number | string | undefined,
    totalPages: number
  ): number {
    const parsedPage =
      typeof page === "string" ? Number.parseInt(page, 10) : page;

    if (parsedPage === undefined || Number.isNaN(parsedPage)) {
      return PaginationService.FIRST_PAGE;
    }

    return Math.min(
      Math.max(PaginationService.FIRST_PAGE, parsedPage),
      totalPages
    );
  }

  private buildPreviousUrl(basePath: string, currentPage: number): string {
    if (currentPage <= PaginationService.FIRST_PAGE) {
      return "";
    }

    if (currentPage === PaginationService.FIRST_PAGE + 1) {
      return `${basePath}/`;
    }

    return `${basePath}/${currentPage - 1}/`;
  }

  private buildNextUrl(
    basePath: string,
    currentPage: number,
    totalPages: number
  ): string {
    if (currentPage >= totalPages) {
      return "";
    }

    return `${basePath}/${currentPage + 1}/`;
  }
}

export const paginationService = new PaginationService();
