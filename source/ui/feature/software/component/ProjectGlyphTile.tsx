import type { JSX } from "react";
import type { IconComponent } from "@ui/icon/IconComponent";
import { ProjectGlyphResolver } from "@ui/feature/software/glyph/ProjectGlyphResolver";

const PROJECT_GLYPH_RESOLVER: ProjectGlyphResolver = new ProjectGlyphResolver();

export interface ProjectGlyphTileProps {
    readonly project: string;
}

export default function ProjectGlyphTile({ project }: ProjectGlyphTileProps): JSX.Element | null {
    const Glyph: IconComponent | null = PROJECT_GLYPH_RESOLVER.find(project);

    if (Glyph === null) {
        return null;
    }

    return (
        <span
            className="order-first flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-skin-line bg-white text-black"
            aria-hidden="true"
        >
            <Glyph className="fill-current" ariaHidden />
        </span>
    );
}
