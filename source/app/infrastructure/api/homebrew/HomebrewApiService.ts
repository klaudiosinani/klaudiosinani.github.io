import type { HttpApiService } from "@app/infrastructure/http/HttpApiService.ts";

export class HomebrewApiService {
    private readonly HOST: string = "https://formulae.brew.sh/api/analytics";

    private readonly httpApiService: HttpApiService;

    public constructor(httpApiService: HttpApiService) {
        this.httpApiService = httpApiService;
    }

    public async getFeed<T>(path: string): Promise<T> {
        return this.httpApiService.get<T>(this.HOST, `${path}.json`, {}, {});
    }
}
