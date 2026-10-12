import { HttpResponse } from "../response/HttpResponse.ts";

export class HttpResponseFileParser {
    public parse(file: string): HttpResponse {
        const parsed: unknown = JSON.parse(file);

        if (!this.isRecord(parsed)) {
            throw new TypeError("The file states no answer that this build can read");
        }

        const endpoint: unknown = parsed.endpoint;
        const status: unknown = parsed.status;
        const body: unknown = parsed.body;

        if (typeof endpoint !== "string" || typeof status !== "number" || typeof body !== "string") {
            throw new TypeError("The file states no endpoint, status and body that this build can read");
        }

        return new HttpResponse(endpoint, status, this.parseHeaders(parsed.headers), body);
    }

    private parseHeaders(headers: unknown): Record<string, string> {
        if (!this.isRecord(headers)) {
            throw new TypeError("The file states no headers that this build can read");
        }

        const httpHeaders: Record<string, string> = {};
        const headerEntries: [string, unknown][] = Object.entries(headers);

        for (const [name, value] of headerEntries) {
            if (typeof value !== "string") {
                throw new TypeError(`The file states no value for the header ${name} that this build can read`);
            }

            httpHeaders[name] = value;
        }

        return httpHeaders;
    }

    private isRecord(subject: unknown): subject is Record<string, unknown> {
        return typeof subject === "object" && subject !== null;
    }
}
