import type { HttpApiService } from "@app/infrastructure/http/HttpApiService.ts";
import type { QueryParameters } from "@app/infrastructure/http/request/QueryParameters.ts";

export class PypiApiService {
    private readonly HOST: string = "https://pypistats.org/api/packages";

    private readonly httpApiService: HttpApiService;

    public constructor(httpApiService: HttpApiService) {
        this.httpApiService = httpApiService;
    }

    public async getResource<T>(
        endpoint: string,
        queryParameters: QueryParameters,
        headers: Record<string, string>
    ): Promise<T> {
        return this.httpApiService.get<T>(this.HOST, endpoint, queryParameters, headers);
    }
}
