import type { HttpRequest } from "../request/HttpRequest.ts";
import type { HttpResponse } from "../response/HttpResponse.ts";

export interface HttpRequestExecutor {
    execute(httpRequest: HttpRequest): Promise<HttpResponse>;
}
