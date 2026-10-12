import type { BuiltinTheme } from "shiki";

const LIGHT_MARKDOWN_THEME = "min-light";
const DARK_MARKDOWN_THEME = "night-owl";

export interface MarkdownStyling {
    readonly themes: { readonly light: BuiltinTheme; readonly dark: BuiltinTheme };
    readonly wrap: boolean;
}

export const MARKDOWN_STYLING: MarkdownStyling = {
    themes: { light: LIGHT_MARKDOWN_THEME, dark: DARK_MARKDOWN_THEME },
    wrap: true,
};
