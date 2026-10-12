import type { LandingSectionKey } from "./LandingSectionKey";

export class LandingSection {
    private readonly key: LandingSectionKey;
    private readonly title: string;
    private readonly href: string | null;
    private readonly more: string | null;

    public constructor(key: LandingSectionKey, title: string, href: string | null, more: string | null) {
        this.key = key;
        this.title = title;
        this.href = href;
        this.more = more;
    }

    public getKey(): LandingSectionKey {
        return this.key;
    }

    public getTitle(): string {
        return this.title;
    }

    public getHref(): string | null {
        return this.href;
    }

    public getMore(): string | null {
        return this.more;
    }
}
