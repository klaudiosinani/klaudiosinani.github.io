export class GithubCommitDto {
    private readonly sha: string;
    private readonly htmlUrl: string;
    private readonly message: string;
    private readonly authoredAt: string;

    public constructor(sha: string, htmlUrl: string, message: string, authoredAt: string) {
        this.sha = sha;
        this.htmlUrl = htmlUrl;
        this.message = message;
        this.authoredAt = authoredAt;
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

    public getAuthoredAt(): string {
        return this.authoredAt;
    }
}
