import { afterEach, describe, expect, it, vi } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import type { MockInstance } from "vitest";
import { RepositoryTrafficProvider } from "@app/feature/repository/service/RepositoryTrafficProvider";

const underTest: RepositoryTrafficProvider = new RepositoryTrafficProvider();

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const respondWith = (body: unknown, status: number = 200): void => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
        status === 200 ? jsonResponse(body) : new Response("", { status, statusText: "Forbidden" })
    );
};

const withToken = (token: string | undefined): void => {
    vi.stubEnv("GITHUB_TRAFFIC_TOKEN", token as string);
};

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

describe("RepositoryTrafficProvider.clones", () => {
    it("givenATrafficToken_whenReading_thenTheCountOfTheWindowIsGiven", async () => {
        withToken("token");
        respondWith({ count: 612, uniques: 240 });

        await expect(underTest.clones(new RepositoryRef("klaudiosinani", "signale"))).resolves.toBe(612);
    });

    it("givenNoTrafficToken_whenReading_thenNothingIsRead", async () => {
        withToken(undefined);
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        await expect(underTest.clones(new RepositoryRef("klaudiosinani", "signale"))).resolves.toBeNull();
        expect(fetched).not.toHaveBeenCalled();
    });

    it("givenARequestThatFailed_whenReading_thenTheFigureIsAbsent", async () => {
        withToken("token");
        respondWith(null, 403);

        await expect(underTest.clones(new RepositoryRef("klaudiosinani", "signale"))).resolves.toBeNull();
    });
});
