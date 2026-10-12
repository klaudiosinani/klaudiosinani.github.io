import type { PaginationBand } from "./PaginationBand";

export class PaginatedResult<T> {
    private readonly paginationBand: PaginationBand;
    private readonly totalItems: number;
    private readonly items: readonly T[];

    public constructor(paginationBand: PaginationBand, totalItems: number, items: readonly T[]) {
        this.paginationBand = paginationBand;
        this.totalItems = totalItems;
        this.items = items;
    }

    public getPaginationBand(): PaginationBand {
        return this.paginationBand;
    }

    public getTotalItems(): number {
        return this.totalItems;
    }

    public getItems(): readonly T[] {
        return this.items;
    }
}
