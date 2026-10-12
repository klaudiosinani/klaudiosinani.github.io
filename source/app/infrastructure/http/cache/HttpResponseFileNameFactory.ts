import { createHash } from "node:crypto";
import type { HttpRequest } from "../request/HttpRequest.ts";

export class HttpResponseFileNameFactory {
    private readonly ENDING: string = ".json";

    public create(httpRequest: HttpRequest): string {
        const method: string = httpRequest.getMethod();
        const endpoint: string = httpRequest.getEndpoint();
        const body: string = httpRequest.getBody() ?? "";
        const digest: string = createHash("sha1").update(`${method} ${endpoint} ${body}`).digest("hex");

        return `${digest}${this.ENDING}`;
    }
}
