export class ContributionSummary {
    private readonly commits: number;
    private readonly tickets: number;
    private readonly from: string;
    private readonly to: string;

    public constructor(commits: number, tickets: number, from: string, to: string) {
        this.commits = commits;
        this.tickets = tickets;
        this.from = from;
        this.to = to;
    }

    public getCommits(): number {
        return this.commits;
    }
    public getTickets(): number {
        return this.tickets;
    }
    public getFrom(): string {
        return this.from;
    }
    public getTo(): string {
        return this.to;
    }
}
