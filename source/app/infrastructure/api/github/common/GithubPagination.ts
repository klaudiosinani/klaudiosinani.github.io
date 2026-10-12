export class GithubPagination {
    private readonly entriesPerPage: number;
    private readonly firstPage: number;
    private readonly lastPage: number;

    public constructor(entriesPerPage: number, firstPage: number, lastPage: number) {
        this.entriesPerPage = entriesPerPage;
        this.firstPage = firstPage;
        this.lastPage = lastPage;
    }

    public getEntriesPerPage(): number {
        return this.entriesPerPage;
    }

    public getFirstPage(): number {
        return this.firstPage;
    }

    public getLastPage(): number {
        return this.lastPage;
    }
}
