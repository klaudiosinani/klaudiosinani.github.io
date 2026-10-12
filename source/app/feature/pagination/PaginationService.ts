import { PaginationBand } from "./PaginationBand";
import { PaginatedResult } from "./PaginatedResult";
import type { PaginationOptions } from "./PaginationOptions";

export class PaginationService {
    private readonly FIRST_PAGE: number = 1;

    private readonly itemsPerPage: number;

    public constructor(itemsPerPage: number) {
        this.itemsPerPage = itemsPerPage;
    }

    public paginate<T>({ items, page, basePath, isIndex }: PaginationOptions<T>): PaginatedResult<T> {
        const totalItems: number = items.length;
        const totalPages: number = this.countPages(totalItems);
        const currentPage: number = isIndex ? this.FIRST_PAGE : this.normalizePage(page, totalPages);

        const startIndex: number = (currentPage - this.FIRST_PAGE) * this.itemsPerPage;

        const paginationBand: PaginationBand = new PaginationBand(
            currentPage,
            totalPages,
            this.buildPreviousUrl(basePath, currentPage),
            this.buildNextUrl(basePath, currentPage, totalPages)
        );

        return new PaginatedResult<T>(
            paginationBand,
            totalItems,
            items.slice(startIndex, startIndex + this.itemsPerPage)
        );
    }

    public pageNumbers(itemCount: number): number[] {
        return Array.from(
            { length: this.countPages(itemCount) },
            (_: unknown, index: number) => index + this.FIRST_PAGE
        );
    }

    public subsequentPageNumbers(itemCount: number): number[] {
        return this.pageNumbers(itemCount).filter((pageNumber: number) => pageNumber > this.FIRST_PAGE);
    }

    private countPages(itemCount: number): number {
        return Math.max(this.FIRST_PAGE, Math.ceil(itemCount / this.itemsPerPage));
    }

    private normalizePage(page: number | string | undefined, totalPages: number): number {
        const parsedPage: number | undefined = typeof page === "string" ? Number.parseInt(page, 10) : page;

        if (parsedPage === undefined || Number.isNaN(parsedPage)) {
            return this.FIRST_PAGE;
        }

        return Math.min(Math.max(this.FIRST_PAGE, parsedPage), totalPages);
    }

    private buildPreviousUrl(basePath: string, currentPage: number): string {
        if (currentPage <= this.FIRST_PAGE) {
            return "";
        }

        if (currentPage === this.FIRST_PAGE + 1) {
            return `${basePath}/`;
        }

        return `${basePath}/${currentPage - 1}/`;
    }

    private buildNextUrl(basePath: string, currentPage: number, totalPages: number): string {
        if (currentPage >= totalPages) {
            return "";
        }

        return `${basePath}/${currentPage + 1}/`;
    }
}
