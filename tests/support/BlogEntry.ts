import type { CollectionEntry } from "astro:content";

interface BlogEntryOptions {
    id?: string;
    title?: string;
    pubDatetime?: Date;
    modDatetime?: Date | null;
    draft?: boolean;
    tags?: string[];
}

export const blogEntry = ({
    id = "a-post",
    title = "A Post",
    pubDatetime = new Date("2026-01-01T12:00:00Z"),
    modDatetime = null,
    draft = false,
    tags = ["others"],
}: BlogEntryOptions = {}): CollectionEntry<"blog"> =>
    ({
        id,
        collection: "blog",
        body: "",
        data: {
            author: "Author",
            title,
            pubDatetime,
            modDatetime,
            draft,
            tags,
            description: "A description",
        },
    }) as unknown as CollectionEntry<"blog">;
