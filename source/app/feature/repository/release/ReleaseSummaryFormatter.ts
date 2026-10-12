export class ReleaseSummaryFormatter {
    private readonly SHORTEST: number = 20;

    public words(notes: string): string {
        return notes
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/^#+\s*/gm, "")
            .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
            .replace(/[*_`>#-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    public format(notes: string, limit: number): string {
        const words: string = this.words(notes);

        if (words.length <= limit) {
            return words;
        }

        const cut: string = words.slice(0, limit - 1);
        const ended: string = cut.slice(0, cut.lastIndexOf(" ")).trim();

        return ended.length >= this.SHORTEST ? `${ended}…` : `${cut.trim()}…`;
    }
}
