export class CommitSubject {
    private readonly ticket: string | null;
    private readonly subject: string;

    public constructor(ticket: string | null, subject: string) {
        this.ticket = ticket;
        this.subject = subject;
    }

    public getTicket(): string | null {
        return this.ticket;
    }
    public getSubject(): string {
        return this.subject;
    }
}
