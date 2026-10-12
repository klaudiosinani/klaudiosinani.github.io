export class SpaceStep {
    private readonly name: string;
    private readonly utility: string;
    private readonly size: string;
    private readonly phoneSize: string;
    private readonly role: string;

    public constructor(name: string, utility: string, size: string, phoneSize: string, role: string) {
        this.name = name;
        this.utility = utility;
        this.size = size;
        this.phoneSize = phoneSize;
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

    public getPhoneSize(): string {
        return this.phoneSize;
    }

    public getRole(): string {
        return this.role;
    }

    public comesCloserOnAPhone(): boolean {
        return this.phoneSize !== this.size;
    }
}
