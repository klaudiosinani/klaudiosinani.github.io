import type { NavigationKey } from "./NavigationKey";

export class NavigationItem {
    private readonly key: NavigationKey;
    private readonly label: string;
    private readonly href: string;

    public constructor(key: NavigationKey, label: string, href: string) {
        this.key = key;
        this.label = label;
        this.href = href;
    }

    public getKey(): NavigationKey {
        return this.key;
    }
    public getLabel(): string {
        return this.label;
    }
    public getHref(): string {
        return this.href;
    }
}
