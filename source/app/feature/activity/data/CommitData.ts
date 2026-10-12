export class CommitData {
    private readonly repository: string;
    private readonly sha: string;
    private readonly message: string;
    private readonly url: string;
    private readonly committedAt: string;

    public constructor(repository: string, sha: string, message: string, url: string, committedAt: string) {
        this.repository = repository;
        this.sha = sha;
        this.message = message;
        this.url = url;
        this.committedAt = committedAt;
    }

    public getRepository(): string {
        return this.repository;
    }
    public getSha(): string {
        return this.sha;
    }
    public getMessage(): string {
        return this.message;
    }
    public getUrl(): string {
        return this.url;
    }
    public getCommittedAt(): string {
        return this.committedAt;
    }
}
