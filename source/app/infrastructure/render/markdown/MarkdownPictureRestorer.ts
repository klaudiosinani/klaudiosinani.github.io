export class MarkdownPictureRestorer {
    private readonly MARKED_PICTURE: RegExp = /<img\s[^>]*?__ASTRO_IMAGE_="([^"]*)"[^>]*>/g;
    private readonly INDEX: string = "index";

    public restore(html: string): string {
        return html.replace(this.MARKED_PICTURE, (_whole: string, marked: string) => {
            const attributes: Record<string, unknown> = this.parse(marked);

            return `<img${this.assemble(attributes)}>`;
        });
    }

    private assemble(attributes: Record<string, unknown>): string {
        return Object.entries(attributes)
            .filter(([name]: [string, unknown]) => name !== this.INDEX)
            .map(([name, value]: [string, unknown]) => ` ${name}="${this.escape(String(value))}"`)
            .join("");
    }

    private parse(marked: string): Record<string, unknown> {
        const body: string = marked
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&");

        return JSON.parse(body) as Record<string, unknown>;
    }

    private escape(value: string): string {
        return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
}
