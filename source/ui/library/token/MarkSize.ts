export class MarkSize {
    private readonly name: string;
    private readonly utility: string;
    private readonly size: string;
    private readonly role: string;

    public constructor(name: string, utility: string, size: string, role: string) {
        this.name = name;
        this.utility = utility;
        this.size = size;
        this.role = role;
    }

    public getName(): string {
        return this.name;
    }

    public getUtility(): string {
        return this.utility;
    }

    public getSize(): string {
        return this.size;
    }

    public getRole(): string {
        return this.role;
    }
}
