export class CommitShaFormatter {
    private readonly LENGTH: number = 7;

    public format(sha: string): string {
        return sha.slice(0, this.LENGTH);
    }
}
