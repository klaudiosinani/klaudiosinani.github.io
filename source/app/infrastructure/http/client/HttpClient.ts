import type { HttpRequestExecutor } from "./HttpRequestExecutor.ts";
import type { HttpRequest } from "../request/HttpRequest.ts";
import type { HttpRequestAssembler } from "../request/HttpRequestAssembler.ts";
import type { HttpResponse } from "../response/HttpResponse.ts";
import type { HttpResponseAssembler } from "../response/HttpResponseAssembler.ts";

export class HttpClient implements HttpRequestExecutor {
    private readonly httpRequestAssembler: HttpRequestAssembler;
    private readonly httpResponseAssembler: HttpResponseAssembler;

    public constructor(httpRequestAssembler: HttpRequestAssembler, httpResponseAssembler: HttpResponseAssembler) {
        this.httpRequestAssembler = httpRequestAssembler;
        this.httpResponseAssembler = httpResponseAssembler;
    }

    public async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        const request: Request = this.httpRequestAssembler.assemble(httpRequest);
        const response: Response = await fetch(request);

        return this.httpResponseAssembler.assemble(response, httpRequest.getEndpoint());
    }
}
