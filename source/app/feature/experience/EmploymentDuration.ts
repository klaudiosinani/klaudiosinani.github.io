export class EmploymentDuration {
    private readonly from: string;
    private readonly to: string;
    private readonly length: string;
    private readonly current: boolean;
    private readonly fromAt: string;
    private readonly toAt: string | null;

    public constructor(
        from: string,
        to: string,
        length: string,
        current: boolean,
        fromAt: string,
        toAt: string | null
    ) {
        this.from = from;
        this.to = to;
        this.length = length;
        this.current = current;
        this.fromAt = fromAt;
        this.toAt = toAt;
    }

    public getFrom(): string {
        return this.from;
    }
    public getTo(): string {
        return this.to;
    }
    public getLength(): string {
        return this.length;
    }
    public isCurrent(): boolean {
        return this.current;
    }
    public getFromAt(): string {
        return this.fromAt;
    }
    public getToAt(): string | null {
        return this.toAt;
    }
    public getFromYear(): string {
        return this.fromAt.slice(0, 4);
    }
    public getToYear(): string {
        return this.toAt ? this.toAt.slice(0, 4) : this.to;
    }
}
