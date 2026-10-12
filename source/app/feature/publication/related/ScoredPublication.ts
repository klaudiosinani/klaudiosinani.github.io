import type { CollectionEntry } from "astro:content";

export class ScoredPublication {
    private readonly publication: CollectionEntry<"blog">;
    private readonly sharedTagCount: number;

    public constructor(publication: CollectionEntry<"blog">, sharedTagCount: number) {
        this.publication = publication;
        this.sharedTagCount = sharedTagCount;
    }

    public getPublication(): CollectionEntry<"blog"> {
        return this.publication;
    }

    public getSharedTagCount(): number {
        return this.sharedTagCount;
    }
}
