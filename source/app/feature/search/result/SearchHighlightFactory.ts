import type { SearchMatch } from "./SearchMatch";
import { SearchSegment } from "./SearchSegment";

export class SearchHighlightFactory {
    private readonly FIELD: string = "title";

    public create(text: string, matches: readonly SearchMatch[]): SearchSegment[] {
        const ranges: readonly (readonly [number, number])[] = this.ranges(matches);

        if (ranges.length === 0) {
            return [new SearchSegment(text, false)];
        }

        const segments: SearchSegment[] = [];
        let at: number = 0;

        for (const [from, to] of this.merged(ranges)) {
            if (from > at) {
                segments.push(new SearchSegment(text.slice(at, from), false));
            }

            segments.push(new SearchSegment(text.slice(from, to + 1), true));
            at = to + 1;
        }

        if (at < text.length) {
            segments.push(new SearchSegment(text.slice(at), false));
        }

        return segments;
    }

    private ranges(matches: readonly SearchMatch[]): readonly (readonly [number, number])[] {
        return matches
            .filter(({ key }: SearchMatch) => key === this.FIELD)
            .flatMap(({ indices }: SearchMatch) => indices)
            .slice()
            .sort((first: readonly [number, number], second: readonly [number, number]) => first[0] - second[0]);
    }

    private merged(ranges: readonly (readonly [number, number])[]): (readonly [number, number])[] {
        const joined: [number, number][] = [];

        for (const [from, to] of ranges) {
            const last: [number, number] | undefined = joined[joined.length - 1];

            if (last && from <= last[1] + 1) {
                last[1] = Math.max(last[1], to);
                continue;
            }

            joined.push([from, to]);
        }

        return joined;
    }
}
