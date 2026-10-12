import type { IconComponent } from "@ui/icon/IconComponent";
import { GraphGlyph } from "@ui/component/icon/glyph/GraphGlyph";
import { PROJECT_GLYPHS } from "./ProjectGlyphs";

export class ProjectGlyphResolver {
    public resolve(name: string): IconComponent {
        return this.find(name) ?? GraphGlyph;
    }

    public find(name: string): IconComponent | null {
        return PROJECT_GLYPHS.get(name.toLowerCase()) ?? null;
    }
}
