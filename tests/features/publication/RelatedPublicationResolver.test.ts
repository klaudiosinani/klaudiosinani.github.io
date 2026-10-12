import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import { blogEntry } from "../../support/BlogEntry";
import { RelatedPublicationResolver } from "@app/feature/publication/service/RelatedPublicationResolver";

const underTest: typeof RelatedPublicationResolver = RelatedPublicationResolver;

const CURRENT: CollectionEntry<"blog"> = blogEntry({
    id: "streams",
    tags: ["java", "stream-api"],
});
const SHARES_TWO: CollectionEntry<"blog"> = blogEntry({
    id: "more-streams",
    tags: ["java", "stream-api"],
});
const SHARES_ONE: CollectionEntry<"blog"> = blogEntry({
    id: "java-alone",
    tags: ["java"],
});
const SHARES_NONE: CollectionEntry<"blog"> = blogEntry({
    id: "linux",
    tags: ["linux"],
});

describe("RelatedPublicationResolver.resolve", () => {
    it("givenArticlesOnTheSameSubjects_whenResolving_thenTheNearestLeads", () => {
        const related: CollectionEntry<"blog">[] = underTest.resolve(CURRENT, [SHARES_NONE, SHARES_ONE, SHARES_TWO]);

        expect(related.map(({ id }: CollectionEntry<"blog">) => id)).toEqual(["more-streams", "java-alone"]);
    });

    it("givenTheArticleItself_whenResolving_thenItIsNotRelatedToItself", () => {
        expect(underTest.resolve(CURRENT, [CURRENT, SHARES_ONE]).map(({ id }: CollectionEntry<"blog">) => id)).toEqual([
            "java-alone",
        ]);
    });

    it("givenADraft_whenResolving_thenItIsNotOffered", () => {
        const draft: CollectionEntry<"blog"> = blogEntry({
            id: "unfinished",
            tags: ["java"],
            draft: true,
        });

        expect(underTest.resolve(CURRENT, [draft]).length).toBe(0);
    });

    it("givenNothingInCommon_whenResolving_thenTheReaderIsStillGivenSomewhereToGo", () => {
        expect(underTest.resolve(CURRENT, [SHARES_NONE]).length).toBe(1);
    });

    it("givenAWantedCount_whenResolving_thenNoMoreThanThatAreGiven", () => {
        expect(underTest.resolve(CURRENT, [SHARES_TWO, SHARES_ONE, SHARES_NONE], 1).length).toBe(1);
    });
});
