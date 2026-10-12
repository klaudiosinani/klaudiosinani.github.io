import { describe, expect, it } from "vitest";
import { RepositoryAddressResolver } from "@app/feature/repository/service/RepositoryAddressResolver";

const underTest: typeof RepositoryAddressResolver = RepositoryAddressResolver;

const REPOSITORY: string = "https://github.com/klaudiosinani/signale";

describe("RepositoryAddressResolver.resolve", () => {
    it("givenALinkToAFileBesideTheText_whenResolving_thenItPointsAtTheRepository", () => {
        expect(underTest.resolve('<a href="docs/guide.md">Guide</a>', REPOSITORY)).toBe(
            `<a href="${REPOSITORY}/blob/HEAD/docs/guide.md">Guide</a>`
        );
    });

    it("givenAPictureBesideTheText_whenResolving_thenItIsServedAsRawContent", () => {
        expect(underTest.resolve('<img src="media/header.png">', REPOSITORY)).toBe(
            '<img src="https://raw.githubusercontent.com/klaudiosinani/signale/HEAD/media/header.png">'
        );
    });

    it("givenAPathThatStartsAtTheRoot_whenResolving_thenTheLeadingMarkIsDropped", () => {
        expect(underTest.resolve('<a href="./docs/a.md">A</a>', REPOSITORY)).toContain("/blob/HEAD/docs/a.md");
    });

    it("givenAnAddressOfItsOwn_whenResolving_thenItIsLeftAsItIs", () => {
        for (const address of [
            "https://klaudiosinani.com/",
            "//example.com/a.png",
            "#install",
            "mailto:someone@example.com",
        ]) {
            expect(underTest.resolve(`<a href="${address}">x</a>`, REPOSITORY)).toBe(`<a href="${address}">x</a>`);
        }
    });
});
