export class LegacyDocumentAddress {
    private readonly from: string;
    private readonly to: string;

    public constructor(from: string, to: string) {
        this.from = from;
        this.to = to;
    }

    public getFrom(): string {
        return this.from;
    }
    public getTo(): string {
        return this.to;
    }
}
