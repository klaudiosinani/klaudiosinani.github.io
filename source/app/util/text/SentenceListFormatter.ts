export class SentenceListFormatter {
    private readonly SEPARATOR: string = "\u00a0· ";
    private readonly WORD_JOINER: string = "\u00a0";
    private readonly WORD_GAP: RegExp = /\s+/;
    private readonly MINOR_WORDS: readonly string[] = [
        "a",
        "an",
        "and",
        "as",
        "at",
        "but",
        "by",
        "for",
        "in",
        "nor",
        "of",
        "on",
        "or",
        "the",
        "to",
    ];

    public format(sentences: readonly string[]): string {
        return sentences
            .map((sentence: string) => sentence.trim())
            .filter((sentence: string) => sentence.length > 0)
            .map((sentence: string) => this.titleOf(sentence))
            .join(this.SEPARATOR);
    }

    private titleOf(sentence: string): string {
        return sentence
            .split(this.WORD_GAP)
            .map((word: string, index: number) =>
                index > 0 && this.MINOR_WORDS.includes(word.toLowerCase()) ? word.toLowerCase() : this.capitalOf(word)
            )
            .join(this.WORD_JOINER);
    }

    private capitalOf(word: string): string {
        return `${word[0].toUpperCase()}${word.slice(1)}`;
    }
}
