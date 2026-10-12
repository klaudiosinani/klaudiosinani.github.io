import type { FontOptions } from "./FontOptions.ts";
import { GoogleFontFace } from "./GoogleFontFace.ts";

export class GoogleFontLoader {
    private readonly STYLESHEET: string = "https://fonts.googleapis.com/css2";
    private readonly SOURCE: RegExp = /src: url\((.+)\) format\('(opentype|truetype)'\)/;
    private readonly LEGACY_USER_AGENT: string =
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

    private readonly googleFontFaces: readonly GoogleFontFace[] = [
        new GoogleFontFace("IBM Plex Mono", "IBM+Plex+Mono", 400, "normal"),
        new GoogleFontFace("IBM Plex Mono", "IBM+Plex+Mono:wght@700", 700, "normal"),
    ];

    public async load(text: string): Promise<FontOptions[]> {
        return Promise.all(
            this.googleFontFaces.map(async (googleFontFace: GoogleFontFace) => ({
                name: googleFontFace.getName(),
                weight: googleFontFace.getWeight(),
                style: googleFontFace.getStyle(),
                data: await this.download(googleFontFace.getFamily(), text),
            }))
        );
    }

    private async download(family: string, text: string): Promise<ArrayBuffer> {
        const url: string = await this.resolveSourceUrl(family, text);
        const response: Response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to download the font: ${response.status}`);
        }

        return response.arrayBuffer();
    }

    private async resolveSourceUrl(family: string, text: string): Promise<string> {
        const request: string = `${this.STYLESHEET}?family=${family}&text=${encodeURIComponent(text)}`;
        const headers: Record<string, string> = { "User-Agent": this.LEGACY_USER_AGENT };
        const response: Response = await fetch(request, { headers: headers });
        const stylesheet: string = await response.text();
        const source: RegExpMatchArray | null = stylesheet.match(this.SOURCE);

        if (source === null) {
            throw new Error("Failed to resolve the font source URL");
        }

        return source[1];
    }
}
