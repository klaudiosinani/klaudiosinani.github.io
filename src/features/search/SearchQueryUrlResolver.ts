export class SearchQueryUrlResolver {
  private static readonly KEY = "q";

  public static query(search: string): string {
    return new URLSearchParams(search).get(SearchQueryUrlResolver.KEY) ?? "";
  }

  public static resolve(
    pathname: string,
    search: string,
    query: string
  ): string {
    if (query.length === 0) return pathname;

    const parameters = new URLSearchParams(search);
    parameters.set(SearchQueryUrlResolver.KEY, query);

    return `${pathname}?${parameters.toString()}`;
  }
}
