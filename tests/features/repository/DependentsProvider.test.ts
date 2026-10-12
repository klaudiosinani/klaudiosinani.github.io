import { afterEach, describe, expect, it, vi } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import type { MockInstance } from "vitest";
import { DependentsProvider } from "@app/feature/repository/service/DependentsProvider";

import type { DependentCounts } from "@app/feature/repository/DependentCounts";
const underTest: DependentsProvider = new DependentsProvider();

const dependentsPage = (repositories: string, packages: string): string => `
  <html><body>
    <div class="table-list-header">
      <a class="btn-link selected"><svg></svg> ${repositories}
        <span class="Counter">Repositories</span></a>
      <a class="btn-link"><svg></svg> ${packages}
        <span class="Counter">Packages</span></a>
    </div>
  </body></html>`;

const serving = (markup: string): Response => new Response(markup, { status: 200 });

afterEach(() => {
    vi.restoreAllMocks();
});

describe("DependentsProvider.counts", () => {
    it("givenTheDependentsPage_whenReadingIt_thenBothCountsAreTaken", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(serving(dependentsPage("154,518", "1,907")));

        const counts: DependentCounts | null = await underTest.counts(new RepositoryRef("klaudiosinani", "signale"));

        expect(counts).toEqual({
            repositories: 154518,
            packages: 1907,
            notable: [],
        });
    });

    it("givenThePage_whenRequestingIt_thenItIsAskedForAsABrowserWould", async () => {
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue(serving(dependentsPage("1", "2")));

        await underTest.counts(new RepositoryRef("klaudiosinani", "signale"));

        const [url, init] = fetched.mock.calls[0];
        expect(String(url)).toBe("https://github.com/klaudiosinani/signale/network/dependents");
        expect((init?.headers as Record<string, string>)["User-Agent"]).toContain("Mozilla");
    });

    it("givenSmallCountsWithoutSeparators_whenReadingThem_thenTheyStillParse", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(serving(dependentsPage("7", "0")));

        const counts: DependentCounts | null = await underTest.counts(new RepositoryRef("klaudiosinani", "arare"));

        expect(counts).toEqual({ repositories: 7, packages: 0, notable: [] });
    });

    it("givenAPageWithoutTheCounts_whenReadingIt_thenNothingIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(serving("<html><body>Something else entirely</body></html>"));

        const counts: DependentCounts | null = await underTest.counts(new RepositoryRef("klaudiosinani", "signale"));

        expect(counts).toBeNull();
    });

    it("givenGitHubRefuses_whenReadingThePage_thenNothingIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 404 }));

        const counts: DependentCounts | null = await underTest.counts(new RepositoryRef("klaudiosinani", "gone"));

        expect(counts).toBeNull();
    });

    it("givenTheRequestFails_whenReadingThePage_thenNothingIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

        const counts: DependentCounts | null = await underTest.counts(new RepositoryRef("klaudiosinani", "signale"));

        expect(counts).toBeNull();
    });
});

describe("DependentsProvider.counts, the names", () => {
    it("givenThePageOfDependents_whenReadingIt_thenTheFirstNamesAreTaken", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                new Response(
                    `<span>154,518 Repositories 1,907 Packages</span>
           <a data-hovercard-type="repository" href="/vercel/next.js">next.js</a>
           <a data-hovercard-type="user" href="/vercel">vercel</a>
           <a data-hovercard-type="repository" href="/withastro/astro">astro</a>`,
                    { status: 200 }
                )
            )
        );

        const counts: DependentCounts | null = await underTest.counts(new RepositoryRef("user", "repo"));

        expect(counts?.notable).toEqual(["vercel/next.js", "withastro/astro"]);
    });

    it("givenAPageThatNamesOneRepositoryTwice_whenReadingIt_thenItIsTakenOnce", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                new Response(
                    `<span>10 Repositories 2 Packages</span>
           <a data-hovercard-type="repository" href="/vercel/next.js">next.js</a>
           <a data-hovercard-type="repository" href="/vercel/next.js">next.js</a>`,
                    { status: 200 }
                )
            )
        );

        expect((await underTest.counts(new RepositoryRef("user", "repo")))?.notable).toEqual(["vercel/next.js"]);
    });

    it("givenAPageThatNamesNoRepository_whenReadingIt_thenNoNameIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(new Response("<span>10 Repositories 2 Packages</span>", { status: 200 }))
        );

        expect((await underTest.counts(new RepositoryRef("user", "repo")))?.notable).toEqual([]);
    });
});

describe("DependentsProvider.counts, the length of the list", () => {
    it("givenAPageOfManyNames_whenReadingIt_thenALineOfThemIsTaken", async () => {
        const rows: string = Array.from(
            { length: 12 },
            (_: unknown, index: number) => `<a data-hovercard-type="repository" href="/owner/repo-${index}">repo</a>`
        ).join("");

        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                new Response(`<span>10 Repositories 2 Packages</span>${rows}`, {
                    status: 200,
                })
            )
        );

        expect((await underTest.counts(new RepositoryRef("user", "repo")))?.notable).toHaveLength(6);
    });
});
