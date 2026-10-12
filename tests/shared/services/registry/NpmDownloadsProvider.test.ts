import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { NpmDownloadsProvider } from "@app/infrastructure/registry/npm/service/NpmDownloadsProvider";

import type { DownloadTotals } from "@app/infrastructure/registry/npm/domain/DownloadTotals";
const TODAY: Date = new Date("2026-08-11T00:00:00Z");

const underTest: NpmDownloadsProvider = new NpmDownloadsProvider(TODAY);

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const DAY: number = 24 * 60 * 60 * 1000;

const series = (days: number, perDay: number) =>
    Array.from({ length: days }, (_: unknown, index: number) => ({
        day: new Date(TODAY.getTime() - (days - 1 - index) * DAY).toISOString().slice(0, 10),
        downloads: perDay,
    }));

const registry = (points: { day: string; downloads: number }[]) =>
    vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) =>
        Promise.resolve(
            jsonResponse({
                downloads: String(input).includes("2025-08-12") ? points : [],
            })
        )
    );

afterEach(() => {
    vi.restoreAllMocks();
});

describe("NpmDownloadsProvider.totals", () => {
    it("givenNoPackages_whenTotalling_thenNoRequestIsMade", async () => {
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        const totals: DownloadTotals = await underTest.totals([]);

        expect(fetched).not.toHaveBeenCalled();
        expect(totals.year).toBe(0);
        expect(totals.trend.year).toEqual([]);
    });

    it("givenADailySeries_whenTotalling_thenEachWindowSlicesTheSameSeries", async () => {
        registry(series(365, 10));

        const totals: DownloadTotals = await underTest.totals(["one"]);

        expect(totals.month).toBe(300);
        expect(totals.quarter).toBe(900);
        expect(totals.year).toBe(3650);
    });

    it("givenADailySeries_whenTotalling_thenEachWindowCarriesItsOwnTrend", async () => {
        registry(series(365, 10));

        const { trend } = await underTest.totals(["one"]);

        expect(trend.month).toHaveLength(30);
        expect(trend.quarter).toHaveLength(90);
        expect(trend.year).toHaveLength(365);
    });

    it("givenSeveralPackages_whenTotalling_thenTheSameDayIsCombined", async () => {
        registry(series(365, 10));

        const totals: DownloadTotals = await underTest.totals(["one", "two"]);

        expect(totals.month).toBe(600);
        expect(totals.trend.month).toHaveLength(30);
    });

    it("givenARegistryOlderThanEighteenMonths_whenTotallingAllTime_thenWindowsAreWalkedBack", async () => {
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockImplementation(() =>
                Promise.resolve(jsonResponse({ downloads: [{ day: "2020-01-01", downloads: 5 }] }))
            );

        const totals: DownloadTotals = await underTest.totals(["one"]);

        expect(fetched.mock.calls.length).toBeGreaterThan(2);
        expect(totals.all).toBeGreaterThan(5);
    });

    it("givenAllTime_whenTotalling_thenTheTrendIsBucketedByMonth", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                jsonResponse({
                    downloads: [
                        { day: "2020-01-01", downloads: 5 },
                        { day: "2020-01-02", downloads: 7 },
                        { day: "2020-02-01", downloads: 3 },
                    ],
                })
            )
        );

        const { trend } = await underTest.totals(["one"]);

        expect(trend.all.length).toBeGreaterThan(0);
        expect(trend.all.length).toBeLessThan(30);
    });

    it("givenAFailingRegistry_whenTotalling_thenNothingIsCounted", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(new Response("nope", { status: 500 })));

        const totals: DownloadTotals = await underTest.totals(["one"]);

        expect(totals.year).toBe(0);
        expect(totals.all).toBe(0);
    });

    it("givenAnUnreachableRegistry_whenTotalling_thenNothingIsCounted", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

        const totals: DownloadTotals = await underTest.totals(["one"]);

        expect(totals.month).toBe(0);
        expect(totals.trend.year).toEqual([]);
    });

    it("givenTheDefaultClock_whenConstructed_thenItStillTotals", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(jsonResponse({ downloads: [] })));

        const totals: DownloadTotals = await new NpmDownloadsProvider().totals(["one"]);

        expect(totals.year).toBe(0);
    });
});
