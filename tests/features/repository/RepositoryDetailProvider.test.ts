import { afterEach, describe, expect, it, vi } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import { RepositoryDetailProvider } from "@app/feature/repository/service/RepositoryDetailProvider";

import type { RepositoryLanguage } from "@app/feature/repository/RepositoryLanguage";
import type { RepositoryCitation } from "@app/feature/repository/RepositoryCitation";
const underTest: RepositoryDetailProvider = new RepositoryDetailProvider();

const jsonResponse = (body: unknown, headers: HeadersInit = {}): Response =>
    new Response(JSON.stringify(body), { status: 200, headers });

const citationFile = (yaml: string) => ({
    html_url: "https://github.com/klaudiosinani/signale/blob/master/CITATION.cff",
    content: Buffer.from(yaml, "utf8").toString("base64"),
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("RepositoryDetailProvider.languages", () => {
    it("givenSeveralLanguages_whenReadingThem_thenEachCarriesItsShareLargestFirst", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ JavaScript: 12163, TypeScript: 4526 }));

        const languages: RepositoryLanguage[] = await underTest.languages(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(languages.map((language: RepositoryLanguage) => language.name)).toEqual(["JavaScript", "TypeScript"]);
        expect(languages[0].share).toBeCloseTo(0.729, 2);
        expect(languages[1].share).toBeCloseTo(0.271, 2);
    });

    it("givenARepositoryWithNoMeasuredCode_whenReadingLanguages_thenNoneAreReported", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}));

        const languages: RepositoryLanguage[] = await underTest.languages(
            new RepositoryRef("klaudiosinani", "awesome-prolog")
        );

        expect(languages).toEqual([]);
    });

    it("givenTheRequestFails_whenReadingLanguages_thenNoneAreReported", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 500 }));

        const languages: RepositoryLanguage[] = await underTest.languages(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(languages).toEqual([]);
    });
});

describe("RepositoryDetailProvider.contributors", () => {
    it("givenAPaginatedListing_whenCounting_thenTheLastPageNumberIsTheCount", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse([{}], {
                link: '<https://api.github.com/repositories/1/contributors?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/1/contributors?per_page=1&page=9>; rel="last"',
            })
        );

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "signale"));

        expect(contributors).toBe(9);
    });

    it("givenNoPagination_whenCounting_thenThereIsExactlyOneContributor", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([{}]));

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "arare"));

        expect(contributors).toBe(1);
    });

    it("givenALinkHeaderWithoutALastPage_whenCounting_thenNothingIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse([{}], { link: '<https://api.github.com/x>; rel="next"' })
        );

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "signale"));

        expect(contributors).toBeNull();
    });

    it("givenTheRequestFails_whenCounting_thenNothingIsClaimedRatherThanZero", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 403 }));

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "signale"));

        expect(contributors).toBeNull();
    });

    it("givenTheRequestThrows_whenCounting_thenNothingIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "signale"));

        expect(contributors).toBeNull();
    });
});

describe("RepositoryDetailProvider.citation", () => {
    it("givenNoCitationFile_whenLookingForOne_thenNothingIsReturned", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Not Found", { status: 404 }));

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation).toBeNull();
    });

    it("givenACitationFile_whenReadingIt_thenTheFileIsCarriedWhole", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse(citationFile('cff-version: 1.2.0\ntitle: "Signale"\nauthors:\n  - name: Klaudio Sinani\n'))
        );

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation?.text).toBe('cff-version: 1.2.0\ntitle: "Signale"\nauthors:\n  - name: Klaudio Sinani');
    });

    it("givenACitationFile_whenReadingIt_thenItsTitleIsTaken", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse(
                citationFile(
                    'cff-version: 1.2.0\ntitle: "Signale: hackable console logger"\nauthors:\n  - name: Klaudio Sinani\n'
                )
            )
        );

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation?.title).toBe("Signale: hackable console logger");
        expect(citation?.url).toContain("CITATION.cff");
    });

    it("givenACitationFileWithoutATitle_whenReadingIt_thenTheLinkStandsAlone", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse(citationFile("cff-version: 1.2.0\nmessage: Please cite\n"))
        );

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation?.title).toBeNull();
    });

    it("givenAFileEntryWithoutContent_whenReadingIt_thenTheLinkStandsAlone", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse({
                html_url: "https://github.com/x/y/blob/main/CITATION.cff",
            })
        );

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation?.title).toBeNull();
    });
});
