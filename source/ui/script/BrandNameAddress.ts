export class BrandNameAddress {
    private readonly PARAMETER: string = "for";

    public read(): string | null {
        return new URL(window.location.href).searchParams.get(this.PARAMETER);
    }

    public write(name: string | null): void {
        const address: URL = new URL(window.location.href);

        if (name === null) {
            address.searchParams.delete(this.PARAMETER);
        } else {
            address.searchParams.set(this.PARAMETER, name);
        }

        window.history.replaceState(window.history.state, "", address);
    }
}

export const BRAND_NAME_ADDRESS: BrandNameAddress = new BrandNameAddress();
