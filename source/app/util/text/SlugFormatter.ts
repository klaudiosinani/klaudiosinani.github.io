export class SlugFormatter {
    private readonly COMBINING_MARKS: RegExp = /[\u0300-\u036f]/g;
    private readonly CAMEL_BOUNDARY: RegExp = /([a-z0-9])([A-Z])/g;
    private readonly ACRONYM_BOUNDARY: RegExp = /([A-Z]+)([A-Z][a-z])/g;
    private readonly LETTER_DIGIT_BOUNDARY: RegExp = /([a-zA-Z])(\d)/g;
    private readonly DIGIT_LETTER_BOUNDARY: RegExp = /(\d)([a-zA-Z])/g;
    private readonly NON_ALPHANUMERIC: RegExp = /[^a-zA-Z0-9]+/g;
    private readonly WHITESPACE: RegExp = /\s+/;

    public format(value: string): string {
        return value
            .normalize("NFD")
            .replace(this.COMBINING_MARKS, "")
            .replace(this.CAMEL_BOUNDARY, "$1 $2")
            .replace(this.ACRONYM_BOUNDARY, "$1 $2")
            .replace(this.LETTER_DIGIT_BOUNDARY, "$1 $2")
            .replace(this.DIGIT_LETTER_BOUNDARY, "$1 $2")
            .replace(this.NON_ALPHANUMERIC, " ")
            .trim()
            .split(this.WHITESPACE)
            .filter(Boolean)
            .join("-")
            .toLowerCase();
    }

    public formatAll(values: string[]): string[] {
        return values.map((value: string) => this.format(value));
    }
}
