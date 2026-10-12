import type { CollectionEntry } from "astro:content";
import { ScoredPublication } from "./ScoredPublication";

export class RelatedPublicationResolver {
    private readonly WANTED: number = 2;

    public resolve(
        current: CollectionEntry<"blog">,
        others: readonly CollectionEntry<"blog">[]
    ): CollectionEntry<"blog">[] {
        const subjects: Set<string> = new Set(current.data.tags);

        const scoredPublications: ScoredPublication[] = others
            .filter((publication: CollectionEntry<"blog">) => publication.id !== current.id && !publication.data.draft)
            .map(
                (publication: CollectionEntry<"blog">) =>
                    new ScoredPublication(
                        publication,
                        publication.data.tags.filter((tag: string) => subjects.has(tag)).length
                    )
            );

        return scoredPublications
            .sort(
                (firstScoredPublication: ScoredPublication, secondScoredPublication: ScoredPublication) =>
                    secondScoredPublication.getSharedTagCount() - firstScoredPublication.getSharedTagCount()
            )
            .slice(0, this.WANTED)
            .map((scoredPublication: ScoredPublication) => scoredPublication.getPublication());
    }
}
