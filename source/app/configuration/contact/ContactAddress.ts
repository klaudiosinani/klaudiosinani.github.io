export class ContactAddress {
    private readonly user: string;
    private readonly host: string;

    public constructor(user: string, host: string) {
        this.user = user;
        this.host = host;
    }

    public getUser(): string {
        return this.user;
    }

    public getHost(): string {
        return this.host;
    }
}
