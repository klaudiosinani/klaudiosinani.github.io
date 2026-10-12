export class PaginationBand {
    private readonly currentPage: number;
    private readonly totalPages: number;
    private readonly prevUrl: string;
    private readonly nextUrl: string;

    public constructor(currentPage: number, totalPages: number, prevUrl: string, nextUrl: string) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.prevUrl = prevUrl;
        this.nextUrl = nextUrl;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }
    public getTotalPages(): number {
        return this.totalPages;
    }
    public getPrevUrl(): string {
        return this.prevUrl;
    }
    public getNextUrl(): string {
        return this.nextUrl;
    }
    public hasPrevious(): boolean {
        return this.currentPage > 1;
    }
    public hasNext(): boolean {
        return this.currentPage < this.totalPages;
    }
}
