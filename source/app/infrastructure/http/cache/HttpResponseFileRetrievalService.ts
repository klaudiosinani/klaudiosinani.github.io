import { readFile } from "node:fs/promises";
import type { HttpRequest } from "../request/HttpRequest.ts";
import type { HttpResponse } from "../response/HttpResponse.ts";
import type { HttpResponseFileParser } from "./HttpResponseFileParser.ts";
import type { HttpResponseFilePathResolver } from "./HttpResponseFilePathResolver.ts";
import type { OptionalReader } from "../../common/OptionalReader.ts";
import type { OptionalReaderFactory } from "../../common/OptionalReaderFactory.ts";

export class HttpResponseFileRetrievalService {
    private readonly ABSENT_FILE: string = "ENOENT";

    private readonly httpResponseFilePathResolver: HttpResponseFilePathResolver;
    private readonly httpResponseFileParser: HttpResponseFileParser;
    private readonly optionalReader: OptionalReader;

    public constructor(
        httpResponseFilePathResolver: HttpResponseFilePathResolver,
        httpResponseFileParser: HttpResponseFileParser,
        optionalReaderFactory: OptionalReaderFactory
    ) {
        this.httpResponseFilePathResolver = httpResponseFilePathResolver;
        this.httpResponseFileParser = httpResponseFileParser;
        this.optionalReader = optionalReaderFactory.create("HttpCache");
    }

    public async retrieve(httpRequest: HttpRequest): Promise<HttpResponse | null> {
        const path: string = this.httpResponseFilePathResolver.resolve(httpRequest);
        const file: string | null = await this.readFile(path);

        if (file === null) {
            return null;
        }

        return this.optionalReader.read<HttpResponse>(`the cache entry at ${path}`, async () =>
            this.httpResponseFileParser.parse(file)
        );
    }

    private async readFile(path: string): Promise<string | null> {
        try {
            return await readFile(path, "utf8");
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === this.ABSENT_FILE) {
                return null;
            }

            throw error;
        }
    }
}
