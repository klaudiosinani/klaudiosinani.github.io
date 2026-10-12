import type { CollectionEntry } from "astro:content";

export class PublicationNeighbours {
    private readonly newer: CollectionEntry<"blog"> | null;
    private readonly older: CollectionEntry<"blog"> | null;

    public constructor(newer: CollectionEntry<"blog"> | null, older: CollectionEntry<"blog"> | null) {
        this.newer = newer;
        this.older = older;
    }

    public getNewer(): CollectionEntry<"blog"> | null {
        return this.newer;
    }
    public getOlder(): CollectionEntry<"blog"> | null {
        return this.older;
    }
}
