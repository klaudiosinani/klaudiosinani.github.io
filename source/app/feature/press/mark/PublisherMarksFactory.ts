import type { PublisherEntry } from "./PublisherEntry";
import { PublisherMark } from "./PublisherMark";

export class PublisherMarksFactory {
    public create(entries: readonly PublisherEntry[]): readonly PublisherMark[] {
        const marks: PublisherMark[] = [];

        for (const publisherEntry of entries) {
            const name: string = publisherEntry.name;
            const mark: string | null | undefined = publisherEntry.mark;

            if (mark && !marks.some((held: PublisherMark) => held.getName() === name)) {
                marks.push(new PublisherMark(name, mark));
            }
        }

        return marks;
    }
}
