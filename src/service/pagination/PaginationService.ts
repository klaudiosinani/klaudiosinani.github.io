import { DEFAULT_ITEMS_PER_PAGE } from "@config";
import type { PaginatedResult } from "./PaginatedResult";
import type { PaginationOptions } from "./PaginationOptions";

export class PaginationService {
  private readonly defaultItemsPerPage: number;

  constructor(defaultItemsPerPage = DEFAULT_ITEMS_PER_PAGE) {
    this.defaultItemsPerPage = defaultItemsPerPage;
  }

  public paginate<T>({
    items,
    page,
    basePath,
    isIndex = false,
  }: Omit<PaginationOptions<T>, "itemsPerPage">): PaginatedResult<T> {
    const currentPage = typeof page === "string" ? parseInt(page) : page;

    const totalItems = items.length;
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / this.defaultItemsPerPage)
    );
    const normalizedPage = Math.max(1, Math.min(currentPage, totalPages));

    const startIndex = (normalizedPage - 1) * this.defaultItemsPerPage;
    const endIndex = Math.min(
      startIndex + this.defaultItemsPerPage,
      totalItems
    );

    const paginatedItems = items.slice(startIndex, endIndex);

    let prevUrl = "";
    let nextUrl = "";

    if (normalizedPage > 1) {
      prevUrl =
        normalizedPage === 2 && !isIndex
          ? basePath
          : `${basePath}/${normalizedPage - 1}`;
    }

    if (normalizedPage < totalPages) {
      nextUrl = `${basePath}/${normalizedPage + 1}`;
    }

    return {
      currentPage: normalizedPage,
      totalPages,
      totalItems,
      items: paginatedItems,
      prevUrl,
      nextUrl,
    };
  }

  public getPageNumbers(itemCount: number): number[] {
    const totalPages = Math.max(
      1,
      Math.ceil(itemCount / this.defaultItemsPerPage)
    );
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}

export const paginationService = new PaginationService();
