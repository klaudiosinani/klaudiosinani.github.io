import { MarkSize } from "./MarkSize";

export const MARK_SIZES: readonly MarkSize[] = [
    new MarkSize("caret", "h-2.5 w-2.5", "10px", "The mark that opens a block a reader can fold away."),
    new MarkSize("meta", "h-3 w-3", "12px", "The mark in the last line of a card, and beside a kind."),
    new MarkSize("figure", "h-3.5 w-3.5", "14px", "The mark on a tile of figures, and in a row of the feed."),
    new MarkSize("control", "h-4 w-4", "16px", "The mark inside a control, a menu, or a heading link."),
    new MarkSize("field", "h-5 w-5", "20px", "The mark inside a field a reader types in."),
    new MarkSize("link", "h-6 w-6", "24px", "The mark of a link, where nothing states another size."),
    new MarkSize("headline", "h-7 w-7", "28px", "The mark beside the headline figure of a page."),
];
