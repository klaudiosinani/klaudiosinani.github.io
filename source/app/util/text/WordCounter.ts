export class WordCounter {
    public count(text: string): number {
        return text.trim().split(/\s+/).filter(Boolean).length;
    }
}
