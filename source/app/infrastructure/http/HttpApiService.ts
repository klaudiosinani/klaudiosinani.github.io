import type { EndpointAssembler } from "./request/EndpointAssembler.ts";
import type { HttpRequestExecutor } from "./client/HttpRequestExecutor.ts";
import type { HttpRequest } from "./request/HttpRequest.ts";
import type { HttpRequestFactory } from "./request/HttpRequestFactory.ts";
import { HttpRequestMethod } from "./request/HttpRequestMethod.ts";
import type { HttpRequestOptions } from "./request/HttpRequestOptions.ts";
import type { HttpRequestOptionsFactory } from "./request/HttpRequestOptionsFactory.ts";
import type { HttpResponse } from "./response/HttpResponse.ts";
import type { HttpResponseJsonParser } from "./response/HttpResponseJsonParser.ts";
import type { QueryParameters } from "./request/QueryParameters.ts";
import { HttpStatusError } from "@app/infrastructure/http/response/HttpStatusError.ts";

export class HttpApiService {
    private readonly TIMEOUT_IN_MILLISECONDS: number = 15000;

    private readonly httpRequestExecutor: HttpRequestExecutor;
    private readonly httpRequestFactory: HttpRequestFactory;
    private readonly endpointAssembler: EndpointAssembler;
    private readonly httpRequestOptionsFactory: HttpRequestOptionsFactory;
    private readonly httpResponseJsonParser: HttpResponseJsonParser;

    public constructor(
        httpRequestExecutor: HttpRequestExecutor,
        httpRequestFactory: HttpRequestFactory,
        endpointAssembler: EndpointAssembler,
        httpRequestOptionsFactory: HttpRequestOptionsFactory,
        httpResponseJsonParser: HttpResponseJsonParser
    ) {
        this.httpRequestExecutor = httpRequestExecutor;
        this.httpRequestFactory = httpRequestFactory;
        this.endpointAssembler = endpointAssembler;
        this.httpRequestOptionsFactory = httpRequestOptionsFactory;
        this.httpResponseJsonParser = httpResponseJsonParser;
    }

    public async get<T>(
        host: string,
        endpoint: string,
        queryParameters: QueryParameters,
        headers: Record<string, string>
    ): Promise<T> {
        const assembledEndpoint: string = this.endpointAssembler.assemble(host, endpoint, queryParameters);
        const response: HttpResponse = await this.executeRequest(
            HttpRequestMethod.GET,
            assembledEndpoint,
            headers,
            undefined
        );

        if (!response.isSuccessful()) {
            throw new HttpStatusError(response.getStatus(), assembledEndpoint);
        }

        return this.httpResponseJsonParser.parse<T>(response);
    }

    public async getText(
        host: string,
        endpoint: string,
        queryParameters: QueryParameters,
        headers: Record<string, string>
    ): Promise<string> {
        const assembledEndpoint: string = this.endpointAssembler.assemble(host, endpoint, queryParameters);
        const response: HttpResponse = await this.executeRequest(
            HttpRequestMethod.GET,
            assembledEndpoint,
            headers,
            undefined
        );

        if (!response.isSuccessful()) {
            throw new HttpStatusError(response.getStatus(), assembledEndpoint);
        }

        return response.getBody();
    }

    public async post<T, B>(host: string, endpoint: string, body: B, headers: Record<string, string>): Promise<T> {
        const assembledEndpoint: string = this.endpointAssembler.assemble(host, endpoint, {});
        const response: HttpResponse = await this.executeRequest<B>(
            HttpRequestMethod.POST,
            assembledEndpoint,
            headers,
            body
        );

        if (!response.isSuccessful()) {
            throw new HttpStatusError(response.getStatus(), assembledEndpoint);
        }

        return this.httpResponseJsonParser.parse<T>(response);
    }

    public async getUnverifiedHttpResponse(
        host: string,
        endpoint: string,
        queryParameters: QueryParameters,
        headers: Record<string, string>
    ): Promise<HttpResponse> {
        const assembledEndpoint: string = this.endpointAssembler.assemble(host, endpoint, queryParameters);
        return this.executeRequest(HttpRequestMethod.GET, assembledEndpoint, headers, undefined);
    }

    private async executeRequest<T>(
        requestMethod: HttpRequestMethod,
        endpoint: string,
        headers: Record<string, string>,
        body: T
    ): Promise<HttpResponse> {
        const requestOptions: HttpRequestOptions = this.httpRequestOptionsFactory.create(this.TIMEOUT_IN_MILLISECONDS);
        const httpRequest: HttpRequest = this.httpRequestFactory.create(
            requestMethod,
            endpoint,
            headers,
            body,
            requestOptions
        );

        return this.httpRequestExecutor.execute(httpRequest);
    }
}
