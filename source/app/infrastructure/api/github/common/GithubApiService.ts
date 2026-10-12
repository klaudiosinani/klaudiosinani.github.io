import type { HttpApiService } from "@app/infrastructure/http/HttpApiService.ts";
import type { HttpResponse } from "@app/infrastructure/http/response/HttpResponse.ts";
import type { QueryParameters } from "@app/infrastructure/http/request/QueryParameters.ts";
import type { GithubPagination } from "./GithubPagination.ts";
import type { GithubRequestHeadersFactory } from "./GithubRequestHeadersFactory.ts";

export class GithubApiService {
    private readonly HOST: string = "https://api.github.com";

    private readonly httpApiService: HttpApiService;
    private readonly githubRequestHeadersFactory: GithubRequestHeadersFactory;

    public constructor(httpApiService: HttpApiService, githubRequestHeadersFactory: GithubRequestHeadersFactory) {
        this.httpApiService = httpApiService;
        this.githubRequestHeadersFactory = githubRequestHeadersFactory;
    }

    public async getEntries<T>(
        endpoint: string,
        queryParameters: QueryParameters,
        pagination: GithubPagination,
        headers: Record<string, string>
    ): Promise<T[]> {
        const entries: T[] = [];

        for (let pageNumber: number = pagination.getFirstPage(); pageNumber <= pagination.getLastPage(); pageNumber++) {
            const query: QueryParameters = this.mergeQueryParameters(queryParameters, pagination, pageNumber);
            const pageEntries: T[] = await this.getResource<T[]>(endpoint, query, headers);

            entries.push(...pageEntries);

            if (this.isLastPage(pagination, pageEntries.length)) {
                break;
            }
        }

        return entries;
    }

    public async getResource<T>(
        endpoint: string,
        queryParameters: QueryParameters,
        headers: Record<string, string>
    ): Promise<T> {
        return this.httpApiService.get<T>(this.HOST, endpoint, queryParameters, this.resolveHeaders(headers));
    }

    public async getText(
        endpoint: string,
        queryParameters: QueryParameters,
        headers: Record<string, string>
    ): Promise<string> {
        return this.httpApiService.getText(this.HOST, endpoint, queryParameters, this.resolveHeaders(headers));
    }

    public async postResource<T, B>(endpoint: string, body: B, headers: Record<string, string>): Promise<T> {
        return this.httpApiService.post<T, B>(this.HOST, endpoint, body, this.resolveHeaders(headers));
    }

    public async getUnverifiedHttpResponse(
        endpoint: string,
        queryParameters: QueryParameters,
        headers: Record<string, string>
    ): Promise<HttpResponse> {
        return this.httpApiService.getUnverifiedHttpResponse(
            this.HOST,
            endpoint,
            queryParameters,
            this.resolveHeaders(headers)
        );
    }

    private resolveHeaders(headers: Record<string, string>): Record<string, string> {
        return this.githubRequestHeadersFactory.create(headers);
    }

    private mergeQueryParameters(
        queryParameters: QueryParameters,
        pagination: GithubPagination,
        pageNumber: number
    ): QueryParameters {
        const entriesPerPage: number = pagination.getEntriesPerPage();

        return {
            ...queryParameters,
            per_page: entriesPerPage,
            page: pageNumber,
        };
    }

    private isLastPage(pagination: GithubPagination, pageEntryCount: number): boolean {
        const entriesPerPage: number = pagination.getEntriesPerPage();

        return pageEntryCount < entriesPerPage;
    }
}
