import { TagPageMetadata } from "./TagPageMetadata";

export class TagPageMetadataResolver {
    private readonly LIMIT: number = 160;

    private readonly SHORTEST: number = 120;

    private readonly CLOSINGS: readonly string[] = [
        "Read them, and the rest of the writing on software engineering, programming languages and open source practice.",
        "Part of the writing of Klaudio Sinani on software engineering and open source practice.",
        "On software engineering and open source practice.",
    ];

    public resolve(tagName: string, author: string, titles: readonly string[]): TagPageMetadata {
        const count: number = titles.length;
        const noun: "article" | "articles" = count === 1 ? "article" : "articles";
        const opening: string = `${count} ${noun} by ${author} about ${tagName}`;

        return new TagPageMetadata(`Articles about ${tagName}`, this.described(opening, titles));
    }

    private described(opening: string, titles: readonly string[]): string {
        const named: string = this.named(opening, titles);

        return named.length >= this.SHORTEST ? named : this.filled(named);
    }

    private named(opening: string, titles: readonly string[]): string {
        return (
            titles
                .reduce((running: string, title: string) => {
                    const grown: string = `${running}${running.endsWith(":") ? "" : ","} ${title}`;

                    return `${grown}.`.length <= this.LIMIT ? grown : running;
                }, `${opening}:`)
                .replace(/:$/, "") + "."
        );
    }

    private filled(described: string): string {
        const fitting: string | undefined = this.CLOSINGS.find(
            (closing: string) => `${described} ${closing}`.length <= this.LIMIT
        );

        return fitting ? `${described} ${fitting}` : described;
    }
}
