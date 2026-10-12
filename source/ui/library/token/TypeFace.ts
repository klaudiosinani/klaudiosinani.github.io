export class TypeFace {
    private readonly name: string;
    private readonly utility: string;
    private readonly role: string;

    public constructor(name: string, utility: string, role: string) {
        this.name = name;
        this.utility = utility;
        this.role = role;
    }

    public getName(): string {
        return this.name;
    }

    public getUtility(): string {
        return this.utility;
    }

    public getRole(): string {
        return this.role;
    }
}
