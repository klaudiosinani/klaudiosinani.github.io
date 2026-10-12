export class Contribution {
    private readonly sha: string;
    private readonly shortSha: string;
    private readonly url: string;
    private readonly date: string;
    private readonly ticket: string | null;
    private readonly subject: string;

    public constructor(
        sha: string,
        shortSha: string,
        url: string,
        date: string,
        ticket: string | null,
        subject: string
    ) {
        this.sha = sha;
        this.shortSha = shortSha;
        this.url = url;
        this.date = date;
        this.ticket = ticket;
        this.subject = subject;
    }

    public getSha(): string {
        return this.sha;
    }
    public getShortSha(): string {
        return this.shortSha;
    }
    public getUrl(): string {
        return this.url;
    }
    public getDate(): string {
        return this.date;
    }
    public getTicket(): string | null {
        return this.ticket;
    }
    public getSubject(): string {
        return this.subject;
    }
}
