import { TextSegment } from "./TextSegment";

export class CodeSegmenter {
    private readonly CODE: RegExp = /`([^`]+)`/g;

    public segment(sentence: string): TextSegment[] {
        const segments: TextSegment[] = [];
        let read: number = 0;

        for (const found of sentence.matchAll(this.CODE)) {
            this.add(segments, sentence.slice(read, found.index), false);
            this.add(segments, found[1], true);

            read = found.index + found[0].length;
        }

        this.add(segments, sentence.slice(read), false);

        return segments;
    }

    private add(segments: TextSegment[], text: string, code: boolean): void {
        if (text.length > 0) {
            segments.push(new TextSegment(text, code));
        }
    }
}
