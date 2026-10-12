import type { ActivityEntry } from "./ActivityEntry";

export class ActivityMonth {
    private readonly name: string;
    private readonly entries: ActivityEntry[];

    public constructor(name: string, entries: ActivityEntry[]) {
        this.name = name;
        this.entries = entries;
    }

    public getName(): string {
        return this.name;
    }
    public getEntries(): ActivityEntry[] {
        return this.entries;
    }
}
