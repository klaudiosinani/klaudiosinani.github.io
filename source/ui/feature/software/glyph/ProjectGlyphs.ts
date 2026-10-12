import type { IconComponent } from "@ui/icon/IconComponent";
import { BookGlyph } from "@ui/component/icon/glyph/BookGlyph";
import { ClapperboardGlyph } from "@ui/component/icon/glyph/ClapperboardGlyph";
import { FlagGlyph } from "@ui/component/icon/glyph/FlagGlyph";
import { HailGlyph } from "@ui/component/icon/glyph/HailGlyph";
import { PokeBallGlyph } from "@ui/component/icon/glyph/PokeBallGlyph";
import { SpeechBubbleGlyph } from "@ui/component/icon/glyph/SpeechBubbleGlyph";
import { TuskGlyph } from "@ui/component/icon/glyph/TuskGlyph";

export const PROJECT_GLYPHS: ReadonlyMap<string, IconComponent> = new Map<string, IconComponent>([
    ["arare", HailGlyph],
    ["hyper-pokemon", PokeBallGlyph],
    ["moviebox", ClapperboardGlyph],
    ["qoa", SpeechBubbleGlyph],
    ["signale", FlagGlyph],
    ["taskbook", BookGlyph],
    ["tusk", TuskGlyph],
]);
