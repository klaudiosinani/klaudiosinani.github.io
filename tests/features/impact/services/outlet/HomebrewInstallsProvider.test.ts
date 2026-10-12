import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { HomebrewInstallsProvider } from "@app/feature/impact/service/outlet/HomebrewInstallsProvider";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";

import type { OutletDownloads } from "@app/feature/impact/OutletDownloads";
const repository = (name: string, language: string | null = "Ruby"): RepositoryData => ({
    name,
    description: "",
    url: `https://github.com/user/${name}`,
    stars: 0,
    forks: 0,
    language,
    latestUpdate: "2026-01-01T00:00:00Z",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestPush: "2026-01-01T00:00:00Z",
});

const underTest: HomebrewInstallsProvider = new HomebrewInstallsProvider();

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const feeds = (items: { formula?: unknown[]; cask?: unknown[] }) =>
    vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) =>
        Promise.resolve(
            jsonResponse({
                items: String(input).includes("cask-install") ? (items.cask ?? []) : (items.formula ?? []),
            })
        )
    );

afterEach(() => {
    vi.restoreAllMocks();
});

describe("HomebrewInstallsProvider.installs", () => {
    it("givenNoNames_whenReadingInstalls_thenNoRequestIsMade", async () => {
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        const installs: OutletDownloads = await underTest.downloads([]);

        expect(fetched).not.toHaveBeenCalled();
        expect(installs.month).toBeNull();
    });

    it("givenCommaGroupedCounts_whenReadingInstalls_thenTheyAreParsedNotCoerced", async () => {
        feeds({ cask: [{ cask: "ao", count: "1,234" }] });

        const { year } = await underTest.downloads([repository("ao")]);

        expect(year).toBe(1234);
    });

    it("givenBothFeeds_whenReadingInstalls_thenFormulaeAndCasksAreCombined", async () => {
        feeds({
            formula: [{ formula: "one", count: "10" }],
            cask: [{ cask: "two", count: "5" }],
        });

        const { month } = await underTest.downloads([repository("one"), repository("two")]);

        expect(month).toBe(15);
    });

    it("givenUnrelatedProjects_whenReadingInstalls_thenTheyAreNotCounted", async () => {
        feeds({ cask: [{ cask: "somebody-else", count: "999" }] });

        const { year } = await underTest.downloads([repository("ao")]);

        expect(year).toBe(0);
    });

    it("givenTheAllTimeWindow_whenReadingInstalls_thenHomebrewCannotReportIt", async () => {
        feeds({ cask: [{ cask: "ao", count: "1" }] });

        const { all } = await underTest.downloads([repository("ao")]);

        expect(all).toBeNull();
    });

    it("givenAMalformedCount_whenReadingInstalls_thenItContributesNothing", async () => {
        feeds({ cask: [{ cask: "ao", count: "not-a-number" }, { cask: "ao" }] });

        const { year } = await underTest.downloads([repository("ao")]);

        expect(year).toBe(0);
    });

    it("givenAFailingFeed_whenReadingInstalls_thenTheOutletReportsNothing", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(new Response("nope", { status: 500 })));
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const installs: OutletDownloads = await underTest.downloads([repository("ao")]);

        expect(installs).toEqual({
            outlet: "homebrew",
            month: null,
            quarter: null,
            year: null,
            all: null,
        });
    });

    it("givenAnUnreachableFeed_whenReadingInstalls_thenTheOutletReportsNothing", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const { month } = await underTest.downloads([repository("ao")]);

        expect(month).toBeNull();
    });

    it("givenAFeedWithoutItems_whenReadingInstalls_thenNothingIsCounted", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(jsonResponse({})));

        const { month } = await underTest.downloads([repository("ao")]);

        expect(month).toBe(0);
    });
});
