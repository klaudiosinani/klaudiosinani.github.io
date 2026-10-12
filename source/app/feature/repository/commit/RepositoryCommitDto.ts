export class RepositoryCommitDto {
    private readonly sha: string;
    private readonly htmlUrl: string;
    private readonly message: string;
    private readonly committedAt: string;

    public constructor(sha: string, htmlUrl: string, message: string, committedAt: string) {
        this.sha = sha;
        this.htmlUrl = htmlUrl;
        this.message = message;
        this.committedAt = committedAt;
    }

    public getSha(): string {
        return this.sha;
    }

    public getHtmlUrl(): string {
        return this.htmlUrl;
    }

    public getMessage(): string {
        return this.message;
    }

    public getCommittedAt(): string {
        return this.committedAt;
    }
}
