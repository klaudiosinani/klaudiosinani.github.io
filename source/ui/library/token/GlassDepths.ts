import { GlassDepth } from "./GlassDepth";

export const GLASS_DEPTHS: readonly GlassDepth[] = [
    new GlassDepth("inline", "glass-inline", "6px", "A chip, a key, a small tinted label inside a line of text."),
    new GlassDepth(
        "raised",
        "glass-raised",
        "10px",
        "A card, a well of figures, a box that holds a command, a control."
    ),
    new GlassDepth("lifted", "glass-lifted", "none", "The same pane brought forward: under the pointer, or selected."),
    new GlassDepth("sticky", "glass-sticky", "14px", "A bar that holds its place while the page moves under it."),
    new GlassDepth("floating", "glass-floating", "18px", "A menu or a note that stands above the text for a moment."),
    new GlassDepth(
        "overlay",
        "glass-overlay",
        "24px",
        "The panel that takes the whole page, and the ground behind it."
    ),
    new GlassDepth("solid", "glass-solid", "none", "A surface that stays opaque among panes that do not."),
    new GlassDepth(
        "flat",
        "glass-flat",
        "none",
        "A control: one colour over the whole of its face, and no fall of light."
    ),
];
