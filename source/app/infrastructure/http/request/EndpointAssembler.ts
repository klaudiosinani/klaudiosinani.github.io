import type { QueryParameters } from "./QueryParameters.ts";

export class EndpointAssembler {
    public assemble(host: string, endpoint: string, queryParameters: QueryParameters): string {
        const path: string = endpoint.replace(/^\/+/, "");
        const url: URL = new URL(`${host}/${path}`);

        Object.entries(queryParameters).forEach(([name, value]: [string, string | number | boolean]) => {
            const queryParameter: string = String(value);
            url.searchParams.set(name, queryParameter);
        });

        return url.toString();
    }
}
