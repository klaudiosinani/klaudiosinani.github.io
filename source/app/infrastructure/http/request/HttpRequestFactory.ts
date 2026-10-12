import { HttpRequest } from "./HttpRequest.ts";
import type { HttpRequestMethod } from "./HttpRequestMethod.ts";
import type { HttpRequestOptions } from "./HttpRequestOptions.ts";

export class HttpRequestFactory {
    public create<T>(
        httpRequestMethod: HttpRequestMethod,
        endpoint: string,
        headers: Record<string, string>,
        body: T,
        httpRequestOptions: HttpRequestOptions
    ): HttpRequest {
        const serializedBody: string | undefined = this.serialize(body);

        return new HttpRequest(httpRequestMethod, endpoint, headers, serializedBody, httpRequestOptions);
    }

    private serialize<T>(body: T): string | undefined {
        if (body !== undefined) {
            return JSON.stringify(body);
        }

        return undefined;
    }
}
