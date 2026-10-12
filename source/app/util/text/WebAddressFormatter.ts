export class WebAddressFormatter {
    private readonly PREFIX: RegExp = /^www\./;

    public host(address: string): string {
        return new URL(address).hostname.replace(this.PREFIX, "");
    }
}
