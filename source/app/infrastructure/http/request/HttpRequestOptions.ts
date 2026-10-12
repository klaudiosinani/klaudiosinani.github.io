export class HttpRequestOptions {
    private readonly abortSignal: AbortSignal;

    public constructor(abortSignal: AbortSignal) {
        this.abortSignal = abortSignal;
    }

    public getAbortSignal(): AbortSignal {
        return this.abortSignal;
    }
}
