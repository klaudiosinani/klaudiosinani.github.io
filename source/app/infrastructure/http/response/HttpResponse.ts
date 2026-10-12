export class HttpResponse {
    private readonly endpoint: string;
    private readonly status: number;
    private readonly headers: Record<string, string>;
    private readonly body: string;

    public constructor(endpoint: string, status: number, headers: Record<string, string>, body: string) {
        this.endpoint = endpoint;
        this.status = status;
        this.headers = headers;
        this.body = body;
    }

    public getEndpoint(): string {
        return this.endpoint;
    }

    public getStatus(): number {
        return this.status;
    }

    public getHeaders(): Record<string, string> {
        return this.headers;
    }

    public getBody(): string {
        return this.body;
    }

    public isSuccessful(): boolean {
        return this.status >= 200 && this.status < 300;
    }

    public isAbsent(): boolean {
        return this.status === 404;
    }
}
