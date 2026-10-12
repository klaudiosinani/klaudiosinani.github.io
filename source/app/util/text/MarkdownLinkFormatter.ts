import { SITE } from "@app/configuration/site/Site";

export class MarkdownLinkFormatter {
    public entry(name: string, path: string, about: string): string {
        return `- [${name}](${this.address(path)}): ${about}`;
    }

    private address(path: string): string {
        return new URL(path, SITE.getWebsite()).href;
    }
}
