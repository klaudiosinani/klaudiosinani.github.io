import type { HttpResponse } from "./HttpResponse.ts";

export class HttpResponseJsonParser {
    public parse<T>(httpResponse: HttpResponse): T {
        const body: string = httpResponse.getBody();

        return JSON.parse(body) as T;
    }
}
