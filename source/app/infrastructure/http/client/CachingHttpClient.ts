import type { HttpRequestExecutor } from "./HttpRequestExecutor.ts";
import type { HttpRequest } from "../request/HttpRequest.ts";
import type { HttpResponse } from "../response/HttpResponse.ts";
import type { HttpResponseFilePersistenceService } from "../cache/HttpResponseFilePersistenceService.ts";
import type { HttpResponseFileRetrievalService } from "../cache/HttpResponseFileRetrievalService.ts";
import type { OptionalReader } from "../../common/OptionalReader.ts";
import type { OptionalReaderFactory } from "../../common/OptionalReaderFactory.ts";

export class CachingHttpClient implements HttpRequestExecutor {
    private readonly httpRequestExecutor: HttpRequestExecutor;
    private readonly httpResponseFileRetrievalService: HttpResponseFileRetrievalService;
    private readonly httpResponseFilePersistenceService: HttpResponseFilePersistenceService;
    private readonly optionalReader: OptionalReader;

    public constructor(
        httpRequestExecutor: HttpRequestExecutor,
        httpResponseFileRetrievalService: HttpResponseFileRetrievalService,
        httpResponseFilePersistenceService: HttpResponseFilePersistenceService,
        optionalReaderFactory: OptionalReaderFactory
    ) {
        this.httpRequestExecutor = httpRequestExecutor;
        this.httpResponseFileRetrievalService = httpResponseFileRetrievalService;
        this.httpResponseFilePersistenceService = httpResponseFilePersistenceService;
        this.optionalReader = optionalReaderFactory.create("HttpCache");
    }

    public async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        const cachedResponse: HttpResponse | null = await this.httpResponseFileRetrievalService.retrieve(httpRequest);

        if (cachedResponse !== null) {
            return cachedResponse;
        }

        const httpResponse: HttpResponse = await this.httpRequestExecutor.execute(httpRequest);

        await this.optionalReader.read<void>(`the cache entry for ${httpRequest.getEndpoint()}`, () =>
            this.httpResponseFilePersistenceService.persist(httpRequest, httpResponse)
        );

        return httpResponse;
    }
}
