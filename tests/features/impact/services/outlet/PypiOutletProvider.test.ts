import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { PypiOutletProvider } from "@app/feature/impact/service/outlet/PypiOutletProvider";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";

import type { OutletDownloads } from "@app/feature/impact/OutletDownloads";
const repository = (name: string, language: string | null = "Python"): RepositoryData => ({
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

const underTest: PypiOutletProvider = new PypiOutletProvider();

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const absent: {
    outlet: string;
    month: null;
    quarter: null;
    year: null;
    all: null;
} = {
    outlet: "pypi",
    month: null,
    quarter: null,
    year: null,
    all: null,
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("PypiOutletProvider.downloads", () => {
    it("givenNoPackages_whenReadingDownloads_thenNoRequestIsMade", async () => {
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        const downloads: OutletDownloads = await underTest.downloads([]);

        expect(fetched).not.toHaveBeenCalled();
        expect(downloads).toEqual(absent);
    });

    it("givenSeveralPackages_whenReadingDownloads_thenTheWindowIsSummed", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(jsonResponse({ data: { last_week: 13, last_month: 105 } }))
        );

        const downloads: OutletDownloads = await underTest.downloads([repository("one"), repository("two")]);

        expect(downloads).toEqual({
            outlet: "pypi",
            month: 210,
            quarter: null,
            year: null,
            all: null,
        });
    });

    it("givenWindowsPypiCannotReport_whenReadingDownloads_thenTheyAreNullRatherThanZero", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(jsonResponse({ data: { last_week: 1, last_month: 2 } }))
        );

        const { quarter, year, all } = await underTest.downloads([repository("one")]);

        expect(quarter).toBeNull();
        expect(year).toBeNull();
        expect(all).toBeNull();
    });

    it("givenARateLimitedService_whenReadingDownloads_thenTheOutletReportsNothing", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(new Response("rate limited", { status: 429 }))
        );
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const downloads: OutletDownloads = await underTest.downloads([repository("one")]);

        expect(downloads).toEqual(absent);
    });

    it("givenAnUnreachableService_whenReadingDownloads_thenTheOutletReportsNothing", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const downloads: OutletDownloads = await underTest.downloads([repository("one")]);

        expect(downloads).toEqual(absent);
    });

    it("givenAResponseWithoutData_whenReadingDownloads_thenTheWindowIsZero", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(jsonResponse({})));

        const { month } = await underTest.downloads([repository("one")]);

        expect(month).toBe(0);
    });
});
