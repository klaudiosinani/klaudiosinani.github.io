import typography from "@tailwindcss/typography";

const withOpacity =
  (variableName: string) =>
  ({ opacityValue }: { opacityValue?: string }): string =>
    opacityValue === undefined
      ? `rgb(var(${variableName}))`
      : `rgba(var(${variableName}), ${opacityValue})`;

export default {
  darkMode: ["selector", "[data-theme='dark']"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,svg,ts,tsx,vue}"],
  theme: {
    screens: {
      sm: "640px",
    },
    extend: {
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
          inverted: withOpacity("--color-fill"),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill"),
          accent: withOpacity("--color-accent"),
          inverted: withOpacity("--color-text-base"),
          card: withOpacity("--color-card"),
          "card-muted": withOpacity("--color-card-muted"),
        },
      },
      outlineColor: {
        skin: {
          fill: withOpacity("--color-accent"),
        },
      },
      borderColor: {
        skin: {
          line: withOpacity("--color-border"),
          fill: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
      },
      fill: {
        skin: {
          base: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
        transparent: "transparent",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            pre: { color: false },
            code: { color: false },
          },
        },
      },
      maxWidth: {
        app: "58rem",
      },
    },
  },
  plugins: [typography],
};
