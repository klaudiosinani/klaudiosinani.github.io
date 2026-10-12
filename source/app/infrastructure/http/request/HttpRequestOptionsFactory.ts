import { HttpRequestOptions } from "./HttpRequestOptions.ts";

export class HttpRequestOptionsFactory {
    public create(timeoutInMilliseconds: number): HttpRequestOptions {
        const abortSignal: AbortSignal = AbortSignal.timeout(timeoutInMilliseconds);

        return new HttpRequestOptions(abortSignal);
    }
}
