import { mkdir, writeFile } from "node:fs/promises";
import type { HttpRequest } from "../request/HttpRequest.ts";
import type { HttpResponse } from "../response/HttpResponse.ts";
import type { HttpResponseFilePathResolver } from "./HttpResponseFilePathResolver.ts";
import type { HttpResponseFileSerializer } from "./HttpResponseFileSerializer.ts";

export class HttpResponseFilePersistenceService {
    private readonly httpResponseFilePathResolver: HttpResponseFilePathResolver;
    private readonly httpResponseFileSerializer: HttpResponseFileSerializer;

    public constructor(
        httpResponseFilePathResolver: HttpResponseFilePathResolver,
        httpResponseFileSerializer: HttpResponseFileSerializer
    ) {
        this.httpResponseFilePathResolver = httpResponseFilePathResolver;
        this.httpResponseFileSerializer = httpResponseFileSerializer;
    }

    public async persist(httpRequest: HttpRequest, httpResponse: HttpResponse): Promise<void> {
        if (!this.shouldBePersisted(httpResponse)) {
            return;
        }

        const path: string = this.httpResponseFilePathResolver.resolve(httpRequest);
        const file: string = this.httpResponseFileSerializer.serialize(httpResponse);

        await mkdir(this.httpResponseFilePathResolver.resolveDirectory(), { recursive: true });
        await writeFile(path, file, "utf8");
    }

    private shouldBePersisted(httpResponse: HttpResponse): boolean {
        return httpResponse.isSuccessful() || httpResponse.isAbsent();
    }
}
