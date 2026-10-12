export class HttpStatusError extends Error {
    private readonly status: number;

    public constructor(status: number, endpoint: string) {
        super(`${status} for ${endpoint}`);

        this.status = status;
    }

    public getStatus(): number {
        return this.status;
    }

    public isAbsent(): boolean {
        return this.status === 404;
    }
}
