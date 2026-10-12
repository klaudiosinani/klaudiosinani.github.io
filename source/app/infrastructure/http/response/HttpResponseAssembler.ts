import { HttpResponse } from "./HttpResponse.ts";

export class HttpResponseAssembler {
    public async assemble(response: Response, endpoint: string): Promise<HttpResponse> {
        const status: number = response.status;
        const headers: Record<string, string> = this.parseHeaders(response.headers);
        const body: string = await response.text();

        return new HttpResponse(endpoint, status, headers, body);
    }

    private parseHeaders(headers: Headers): Record<string, string> {
        const headerEntries: IterableIterator<[string, string]> = headers.entries();

        return Object.fromEntries(headerEntries);
    }
}
