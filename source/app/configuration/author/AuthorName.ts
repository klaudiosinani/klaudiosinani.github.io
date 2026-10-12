export class AuthorName {
    private readonly given: string;
    private readonly family: string;

    public constructor(given: string, family: string) {
        this.given = given;
        this.family = family;
    }

    public getGiven(): string {
        return this.given;
    }
    public getFamily(): string {
        return this.family;
    }
}
