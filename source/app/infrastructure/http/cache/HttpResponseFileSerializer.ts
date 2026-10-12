import type { HttpResponse } from "../response/HttpResponse.ts";

export class HttpResponseFileSerializer {
    private readonly INDENTATION: number = 4;

    public serialize(httpResponse: HttpResponse): string {
        return JSON.stringify(
            {
                endpoint: httpResponse.getEndpoint(),
                status: httpResponse.getStatus(),
                headers: httpResponse.getHeaders(),
                body: httpResponse.getBody(),
            },
            null,
            this.INDENTATION
        );
    }
}
