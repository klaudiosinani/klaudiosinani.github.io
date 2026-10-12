import type { SocialIconName } from "@ui/icon/SocialIconName";

export class SocialLink {
    private readonly name: SocialIconName;
    private readonly href: string;
    private readonly linkTitle: string;
    private readonly active: boolean;

    public constructor(name: SocialIconName, href: string, linkTitle: string, active: boolean) {
        this.name = name;
        this.href = href;
        this.linkTitle = linkTitle;
        this.active = active;
    }

    public getName(): SocialIconName {
        return this.name;
    }
    public getHref(): string {
        return this.href;
    }
    public getLinkTitle(): string {
        return this.linkTitle;
    }
    public isActive(): boolean {
        return this.active;
    }

    public isOnTheWeb(): boolean {
        return this.active && this.href.startsWith("http");
    }
}
