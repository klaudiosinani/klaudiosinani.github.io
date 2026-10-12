import type { HttpRequest } from "./HttpRequest.ts";
import type { HttpRequestMethod } from "./HttpRequestMethod.ts";

export class HttpRequestAssembler {
    public assemble(httpRequest: HttpRequest): Request {
        const endpoint: string = httpRequest.getEndpoint();
        const httpRequestMethod: HttpRequestMethod = httpRequest.getMethod();
        const headers: Record<string, string> = httpRequest.getHeaders();
        const body: string | undefined = httpRequest.getBody();
        const abortSignal: AbortSignal = httpRequest.getOptions().getAbortSignal();

        return new Request(endpoint, {
            method: httpRequestMethod,
            headers: headers,
            body: body,
            signal: abortSignal,
        });
    }
}
