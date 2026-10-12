import { describe, expect, it } from "vitest";
import { PublicationKindResolver } from "@app/feature/publication/entry/PublicationKindResolver";
import { SlugFormatter } from "@app/util/text/SlugFormatter";

describe("PublicationKindResolver", () => {
    const publicationKindResolver: PublicationKindResolver = new PublicationKindResolver(new SlugFormatter());

    it("givenTheTagOfAWhitePaper_whenResolving_thenTheKindIsAWhitePaper", () => {
        expect(publicationKindResolver.resolve(["java", "stream-api", "white-paper"])).toBe("White paper");
    });

    it("givenTheTagOfARelease_whenResolving_thenTheKindIsARelease", () => {
        expect(publicationKindResolver.resolve(["release", "singlie"])).toBe("Release");
    });

    it("givenNoKnownTag_whenResolving_thenTheKindIsAnArticle", () => {
        expect(publicationKindResolver.resolve(["linux"])).toBe("Article");
    });
});
