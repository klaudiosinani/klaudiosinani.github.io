import { afterEach, describe, expect, it, vi } from "vitest";
import { PypiDownloadsProvider } from "@app/infrastructure/registry/pypi/service/PypiDownloadsProvider";

const underTest: PypiDownloadsProvider = new PypiDownloadsProvider();

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const respondWith = (body: unknown, status: number = 200): void => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
        status === 200 ? jsonResponse(body) : new Response("", { status, statusText: "Too Many Requests" })
    );
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("PypiDownloadsProvider.recentMonth", () => {
    it("givenAPackage_whenReading_thenTheLastMonthIsGiven", async () => {
        respondWith({ data: { last_day: 4, last_week: 22, last_month: 96 } });

        await expect(underTest.recentMonth("moviebox")).resolves.toBe(96);
    });

    it("givenARefusedRequest_whenReading_thenTheFigureIsAbsent", async () => {
        respondWith(null, 429);

        await expect(underTest.recentMonth("moviebox")).resolves.toBeNull();
    });
});

describe("PypiDownloadsProvider.window", () => {
    it("givenTheDaysItHolds_whenReading_thenTheyAreAddedAndCounted", async () => {
        respondWith({
            data: [
                { date: "2026-08-14", downloads: 10 },
                { date: "2026-08-15", downloads: 6 },
                { date: "2026-08-16", downloads: 4 },
            ],
        });

        await expect(underTest.window("moviebox")).resolves.toEqual({
            downloads: 20,
            days: 3,
        });
    });

    it("givenSeveralRowsForOneDay_whenReading_thenThatDayIsCountedOnce", async () => {
        respondWith({
            data: [
                { date: "2026-08-16", downloads: 4 },
                { date: "2026-08-16", downloads: 2 },
            ],
        });

        await expect(underTest.window("moviebox")).resolves.toEqual({
            downloads: 6,
            days: 1,
        });
    });

    it("givenAPackageThatTheServiceDoesNotKnow_whenReading_thenNothingIsGiven", async () => {
        respondWith({ data: [] });

        await expect(underTest.window("moviebox")).resolves.toBeNull();
    });

    it("givenARefusedRequest_whenReading_thenNothingIsGiven", async () => {
        respondWith(null, 429);

        await expect(underTest.window("moviebox")).resolves.toBeNull();
    });
});
