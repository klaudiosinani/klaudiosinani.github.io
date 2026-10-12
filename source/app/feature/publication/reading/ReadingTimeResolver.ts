import type { WordCounter } from "@app/util/text/WordCounter";

export class ReadingTimeResolver {
    private readonly wordCounter: WordCounter;
    private readonly PACE: number = 200;

    public constructor(wordCounter: WordCounter) {
        this.wordCounter = wordCounter;
    }

    public minutes(body: string): number {
        return Math.max(1, Math.round(this.wordCounter.count(body) / this.PACE));
    }
}
