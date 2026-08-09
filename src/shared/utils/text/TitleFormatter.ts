export class TitleFormatter {
  private static readonly WORD_SEPARATOR = "-";

  public static format(value: string): string {
    return value
      .split(TitleFormatter.WORD_SEPARATOR)
      .map(word => TitleFormatter.capitalize(word))
      .join(" ");
  }

  private static capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
