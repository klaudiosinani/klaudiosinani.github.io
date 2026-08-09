import type { FontOptions } from "./FontOptions";

/** Downloads the OpenGraph typeface from Google Fonts at build time */
export class GoogleFontLoader {
  private static readonly STYLESHEET = "https://fonts.googleapis.com/css2";
  private static readonly SOURCE =
    /src: url\((.+)\) format\('(opentype|truetype)'\)/;

  private static readonly LEGACY_USER_AGENT =
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

  private static readonly FACES = [
    {
      name: "IBM Plex Mono",
      family: "IBM+Plex+Mono",
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      family: "IBM+Plex+Mono:wght@700",
      weight: 700,
      style: "normal",
    },
  ] as const;

  public static async load(text: string): Promise<FontOptions[]> {
    return Promise.all(
      GoogleFontLoader.FACES.map(async ({ name, family, weight, style }) => ({
        name,
        weight,
        style,
        data: await GoogleFontLoader.download(family, text),
      }))
    );
  }

  private static async download(
    family: string,
    text: string
  ): Promise<ArrayBuffer> {
    const url = await GoogleFontLoader.resolveSourceUrl(family, text);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download the font: ${response.status}`);
    }

    return response.arrayBuffer();
  }

  private static async resolveSourceUrl(
    family: string,
    text: string
  ): Promise<string> {
    const request = `${GoogleFontLoader.STYLESHEET}?family=${family}&text=${encodeURIComponent(text)}`;
    const stylesheet = await (
      await fetch(request, {
        headers: { "User-Agent": GoogleFontLoader.LEGACY_USER_AGENT },
      })
    ).text();

    const source = stylesheet.match(GoogleFontLoader.SOURCE);

    if (!source) throw new Error("Failed to resolve the font source URL");

    return source[1];
  }
}
