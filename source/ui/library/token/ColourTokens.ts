import { ColourToken } from "./ColourToken";

export const COLOUR_TOKENS: readonly ColourToken[] = [
    new ColourToken("fill", "--color-fill", "skin-fill", "The ground of the page. Every pane of glass lies on it."),
    new ColourToken("text-base", "--color-text-base", "skin-base", "The words, and the marks that stand beside them."),
    new ColourToken("accent", "--color-accent", "skin-accent", "Where the reader is, and the one control that asks."),
    new ColourToken("card", "--color-card", "skin-card", "The tint a pane carries. It holds the hue of the page."),
    new ColourToken(
        "card-muted",
        "--color-card-muted",
        "skin-card-muted",
        "A pane that is lifted, and the rail of a timeline."
    ),
    new ColourToken("border", "--color-border", "skin-line", "The hairline at the edge of a pane."),
    new ColourToken(
        "live",
        "--color-live",
        "skin-live",
        "The state of the work: a curve, a dot, a day that has work in it."
    ),
    new ColourToken(
        "live-strong",
        "--color-live-strong",
        "skin-live-strong",
        "The same green, dark enough to carry words."
    ),
    new ColourToken(
        "release",
        "--color-release",
        "skin-release",
        "Reserved. A release, where the marks stop being one colour."
    ),
    new ColourToken(
        "commit",
        "--color-commit",
        "skin-commit",
        "Reserved. A commit, where the marks stop being one colour."
    ),
    new ColourToken(
        "signal-success",
        "--color-signal-success",
        "skin-signal-success",
        "Downloads, and a figure that grows."
    ),
    new ColourToken("signal-star", "--color-signal-star", "skin-signal-star", "Stars."),
    new ColourToken("signal-info", "--color-signal-info", "skin-signal-info", "The views of the repositories."),
    new ColourToken(
        "signal-complete",
        "--color-signal-complete",
        "skin-signal-complete",
        "The repositories that depend on the work."
    ),
    new ColourToken("signal-fav", "--color-signal-fav", "skin-signal-fav", "The brand of a partner, and nothing else."),
    new ColourToken(
        "terminal",
        "--color-terminal",
        "skin-terminal",
        "The window of the terminal. The one dark object on the page."
    ),
    new ColourToken("terminal-ink", "--color-terminal-ink", "skin-terminal-ink", "The words in the terminal."),
    new ColourToken(
        "terminal-muted",
        "--color-terminal-muted",
        "skin-terminal-muted",
        "The prompt, and a hint in a field."
    ),
    new ColourToken(
        "terminal-rim",
        "--color-terminal-rim",
        "skin-terminal-rim",
        "The edge of the terminal on the dark page."
    ),
];
