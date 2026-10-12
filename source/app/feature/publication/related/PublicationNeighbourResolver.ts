import type { CollectionEntry } from "astro:content";
import { PublicationNeighbours } from "./PublicationNeighbours";

export class PublicationNeighbourResolver {
    public resolve(
        current: CollectionEntry<"blog">,
        sorted: readonly CollectionEntry<"blog">[]
    ): PublicationNeighbours {
        const at: number = sorted.findIndex((entry: CollectionEntry<"blog">) => entry.id === current.id);

        if (at === -1) {
            return new PublicationNeighbours(null, null);
        }

        return new PublicationNeighbours(
            at > 0 ? sorted[at - 1] : null,
            at + 1 < sorted.length ? sorted[at + 1] : null
        );
    }
}
