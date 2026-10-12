import { FieldPalette } from "./FieldPalette";

export class FieldPaletteReader {
    public read(): FieldPalette {
        const cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(document.documentElement);

        return new FieldPalette(
            this.channelsOf(cssStyleDeclaration, "--color-text-base"),
            this.channelsOf(cssStyleDeclaration, "--color-border"),
            this.channelsOf(cssStyleDeclaration, "--color-live"),
            this.channelsOf(cssStyleDeclaration, "--color-fill")
        );
    }

    private channelsOf(cssStyleDeclaration: CSSStyleDeclaration, name: string): string {
        return cssStyleDeclaration.getPropertyValue(name).trim();
    }
}
