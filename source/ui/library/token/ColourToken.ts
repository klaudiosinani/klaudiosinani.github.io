export class ColourToken {
    private readonly name: string;
    private readonly variable: string;
    private readonly utility: string;
    private readonly role: string;

    public constructor(name: string, variable: string, utility: string, role: string) {
        this.name = name;
        this.variable = variable;
        this.utility = utility;
        this.role = role;
    }

    public getName(): string {
        return this.name;
    }

    public getVariable(): string {
        return this.variable;
    }

    public getUtility(): string {
        return this.utility;
    }

    public getRole(): string {
        return this.role;
    }

    public resolveColour(): string {
        return `rgb(var(${this.variable}))`;
    }
}
