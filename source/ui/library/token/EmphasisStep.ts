export class EmphasisStep {
    private readonly name: string;
    private readonly utility: string;
    private readonly weight: number;
    private readonly role: string;

    public constructor(name: string, utility: string, weight: number, role: string) {
        this.name = name;
        this.utility = utility;
        this.weight = weight;
        this.role = role;
    }

    public getName(): string {
        return this.name;
    }

    public getUtility(): string {
        return this.utility;
    }

    public getWeight(): number {
        return this.weight;
    }

    public getRole(): string {
        return this.role;
    }
}
