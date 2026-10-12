import type { HttpRequestMethod } from "./HttpRequestMethod.ts";
import type { HttpRequestOptions } from "./HttpRequestOptions.ts";

export class HttpRequest {
    private readonly httpRequestMethod: HttpRequestMethod;
    private readonly endpoint: string;
    private readonly headers: Record<string, string>;
    private readonly body: string | undefined;
    private readonly httpRequestOptions: HttpRequestOptions;

    public constructor(
        httpRequestMethod: HttpRequestMethod,
        endpoint: string,
        headers: Record<string, string>,
        body: string | undefined,
        httpRequestOptions: HttpRequestOptions
    ) {
        this.httpRequestMethod = httpRequestMethod;
        this.endpoint = endpoint;
        this.headers = headers;
        this.body = body;
        this.httpRequestOptions = httpRequestOptions;
    }

    public getMethod(): HttpRequestMethod {
        return this.httpRequestMethod;
    }

    public getEndpoint(): string {
        return this.endpoint;
    }

    public getHeaders(): Record<string, string> {
        return this.headers;
    }

    public getBody(): string | undefined {
        return this.body;
    }

    public getOptions(): HttpRequestOptions {
        return this.httpRequestOptions;
    }
}
