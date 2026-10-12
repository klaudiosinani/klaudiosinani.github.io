import { SITE } from "@app/configuration/site/Site";

export class PageOgAddressAssembler {
    private readonly HOST: string = new URL(SITE.getWebsite()).hostname;
    private readonly TRAILING_SLASHES: RegExp = /\/+$/;

    public assemble(route: string): string {
        return `${this.HOST}${route}/`.replace(this.TRAILING_SLASHES, "/");
    }
}
