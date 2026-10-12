import { join } from "node:path";
import type { HttpRequest } from "../request/HttpRequest.ts";
import type { HttpResponseFileNameFactory } from "./HttpResponseFileNameFactory.ts";

export class HttpResponseFilePathResolver {
    private readonly CACHE_DIRECTORY: string = ".cache/http";

    private readonly httpResponseFileNameFactory: HttpResponseFileNameFactory;

    public constructor(httpResponseFileNameFactory: HttpResponseFileNameFactory) {
        this.httpResponseFileNameFactory = httpResponseFileNameFactory;
    }

    public resolve(httpRequest: HttpRequest): string {
        const name: string = this.httpResponseFileNameFactory.create(httpRequest);

        return join(this.CACHE_DIRECTORY, name);
    }

    public resolveDirectory(): string {
        return this.CACHE_DIRECTORY;
    }
}
