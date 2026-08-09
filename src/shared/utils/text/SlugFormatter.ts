/** Converts arbitrary text into dash-case slugs used in URLs and view transitions */
export class SlugFormatter {
  private static readonly COMBINING_MARKS = /[\u0300-\u036f]/g;
  private static readonly CAMEL_BOUNDARY = /([a-z0-9])([A-Z])/g;
  private static readonly ACRONYM_BOUNDARY = /([A-Z]+)([A-Z][a-z])/g;
  private static readonly LETTER_DIGIT_BOUNDARY = /([a-zA-Z])(\d)/g;
  private static readonly DIGIT_LETTER_BOUNDARY = /(\d)([a-zA-Z])/g;
  private static readonly NON_ALPHANUMERIC = /[^a-zA-Z0-9]+/g;
  private static readonly WHITESPACE = /\s+/;

  /** Splits on case, letter/digit and punctuation boundaries; diacritics are
   *  stripped first so accents survive as their base letters */
  public static format(value: string): string {
    return value
      .normalize("NFD")
      .replace(SlugFormatter.COMBINING_MARKS, "")
      .replace(SlugFormatter.CAMEL_BOUNDARY, "$1 $2")
      .replace(SlugFormatter.ACRONYM_BOUNDARY, "$1 $2")
      .replace(SlugFormatter.LETTER_DIGIT_BOUNDARY, "$1 $2")
      .replace(SlugFormatter.DIGIT_LETTER_BOUNDARY, "$1 $2")
      .replace(SlugFormatter.NON_ALPHANUMERIC, " ")
      .trim()
      .split(SlugFormatter.WHITESPACE)
      .filter(Boolean)
      .join("-")
      .toLowerCase();
  }

  public static formatAll(values: string[]): string[] {
    return values.map(value => SlugFormatter.format(value));
  }
}
