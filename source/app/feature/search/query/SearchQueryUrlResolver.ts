export class SearchQueryUrlResolver {
    private readonly KEY: string = "q";

    public query(search: string): string {
        return new URLSearchParams(search).get(this.KEY) ?? "";
    }

    public resolve(pathname: string, search: string, query: string): string {
        if (query.length === 0) return pathname;

        const parameters: URLSearchParams = new URLSearchParams(search);
        parameters.set(this.KEY, query);

        return `${pathname}?${parameters.toString()}`;
    }
}
