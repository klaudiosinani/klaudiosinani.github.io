import type { CommitChecks } from "./CommitChecks";

export class RepositoryCommit {
    private readonly sha: string;
    private readonly message: string;
    private readonly url: string;
    private readonly committedAt: string;
    private readonly checks: CommitChecks | null;

    public constructor(sha: string, message: string, url: string, committedAt: string, checks: CommitChecks | null) {
        this.sha = sha;
        this.message = message;
        this.url = url;
        this.committedAt = committedAt;
        this.checks = checks;
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
    public getChecks(): CommitChecks | null {
        return this.checks;
    }
}
