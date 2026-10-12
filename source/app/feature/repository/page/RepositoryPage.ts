import type { RepositoryPageKey } from "./RepositoryPageKey";
export class RepositoryPage {
    private readonly key: RepositoryPageKey;
    private readonly label: string;
    private readonly href: string;
    private readonly current: boolean;

    public constructor(key: RepositoryPageKey, label: string, href: string, current: boolean) {
        this.key = key;
        this.label = label;
        this.href = href;
        this.current = current;
    }

    public getKey(): RepositoryPageKey {
        return this.key;
    }
    public getLabel(): string {
        return this.label;
    }
    public getHref(): string {
        return this.href;
    }
    public isCurrent(): boolean {
        return this.current;
    }
}
