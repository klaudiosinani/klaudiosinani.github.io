export class Outlet {
    private readonly name: string;
    private readonly href: string;

    public constructor(name: string, href: string) {
        this.name = name;
        this.href = href;
    }

    public getName(): string {
        return this.name;
    }

    public getHref(): string {
        return this.href;
    }
}
