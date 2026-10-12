export class SearchQueryValidator {
    private readonly MINIMUM_QUERY_LENGTH: number = 2;

    public isQueryable(query: string): boolean {
        return query.length >= this.MINIMUM_QUERY_LENGTH;
    }
}
