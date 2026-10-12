import type { render } from "astro:content";

export type RenderedContent = Awaited<ReturnType<typeof render>>["Content"];
