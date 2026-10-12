import type { SearchItem } from "./SearchItem";

export class SearchSubjectsFactory {
    private readonly SHOWN: number = 10;

    public create(items: readonly SearchItem[]): string[] {
        const counts: Map<string, number> = new Map<string, number>();

        for (const { keywords } of items) {
            for (const keyword of keywords) {
                counts.set(keyword, (counts.get(keyword) ?? 0) + 1);
            }
        }

        return [...counts.entries()]
            .filter(([, held]: [string, number]) => held > 1)
            .sort(
                (first: [string, number], second: [string, number]) =>
                    second[1] - first[1] || first[0].localeCompare(second[0])
            )
            .slice(0, this.SHOWN)
            .map(([keyword]: [string, number]) => keyword);
    }
}
