export class TitleFormatter {
    private readonly WORD_SEPARATOR: string = "-";

    public format(value: string): string {
        return value
            .split(this.WORD_SEPARATOR)
            .map((word: string) => this.capitalize(word))
            .join(" ");
    }

    private capitalize(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}
