import type { HttpApiService } from "@app/infrastructure/http/HttpApiService.ts";
import type { SnapcraftRequestHeadersFactory } from "./SnapcraftRequestHeadersFactory.ts";

export class SnapcraftApiService {
    private readonly HOST: string = "https://dashboard.snapcraft.io/dev/api";

    private readonly httpApiService: HttpApiService;
    private readonly snapcraftRequestHeadersFactory: SnapcraftRequestHeadersFactory;

    public constructor(httpApiService: HttpApiService, snapcraftRequestHeadersFactory: SnapcraftRequestHeadersFactory) {
        this.httpApiService = httpApiService;
        this.snapcraftRequestHeadersFactory = snapcraftRequestHeadersFactory;
    }

    public async postResource<T, B>(endpoint: string, body: B, headers: Record<string, string>): Promise<T> {
        const requestHeaders: Record<string, string> = this.snapcraftRequestHeadersFactory.create(headers);

        return this.httpApiService.post<T, B>(this.HOST, endpoint, body, requestHeaders);
    }
}
