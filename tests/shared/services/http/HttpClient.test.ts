import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { HttpClient } from "@app/infrastructure/http/HttpClient.ts";

const client = (limit: number = 8): HttpClient => new HttpClient(limit, () => Promise.resolve());

const answer = (status: number, headers: Record<string, string> = {}) => new Response("", { status, headers });

afterEach(() => {
    vi.restoreAllMocks();
});

describe("HttpClient.send", () => {
    it("givenTheClientOfTheBuild_whenSendingAgain_thenItWaitsBeforeItDoes", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(answer(429, { "retry-after": "0.05" }))
            .mockResolvedValueOnce(answer(200));

        const started: number = Date.now();

        const response: Response | null = await new HttpClient().send("https://example.test");

        expect(response?.status).toBe(200);
        expect(Date.now() - started).toBeGreaterThanOrEqual(40);
    });

    it("givenAServiceThatAnswers_whenSending_thenTheAnswerIsGivenBack", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(answer(200));

        expect((await client().send("https://example.test"))?.status).toBe(200);
    });

    it("givenAServiceThatIsBusyAndThenFree_whenSending_thenItIsAskedAgain", async () => {
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(answer(429))
            .mockResolvedValueOnce(answer(200));

        const response: Response | null = await client().send("https://example.test");

        expect(response?.status).toBe(200);
        expect(fetched).toHaveBeenCalledTimes(2);
    });

    it("givenAServiceThatStaysBusy_whenSending_thenItGivesUpAndSaysSo", async () => {
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch").mockResolvedValue(answer(429));

        const response: Response | null = await client().send("https://example.test");

        expect(response?.status).toBe(429);
        expect(fetched).toHaveBeenCalledTimes(3);
    });

    it("givenAnAnswerThatWillNotChange_whenSending_thenItIsAskedOnlyOnce", async () => {
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch").mockResolvedValue(answer(404));

        await client().send("https://example.test");
        expect(fetched).toHaveBeenCalledTimes(1);
    });

    it("givenAServiceThatCannotBeReached_whenSending_thenNothingIsGivenBack", async () => {
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockRejectedValue(new Error("offline"));

        await expect(client().send("https://example.test")).resolves.toBeNull();
        expect(fetched).toHaveBeenCalledTimes(3);
    });

    it("givenMoreRequestsThanTheLimit_whenSending_thenOnlyTheLimitIsInFlight", async () => {
        let running: number = 0;
        let highest: number = 0;

        vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
            running += 1;
            highest = Math.max(highest, running);
            await Promise.resolve();
            running -= 1;

            return answer(200);
        });

        const underTest: HttpClient = client(2);

        await Promise.all(Array.from({ length: 8 }, () => underTest.send("https://example.test")));

        expect(highest).toBeLessThanOrEqual(2);
    });

    it("givenHeadersToSend_whenSending_thenTheyReachTheService", async () => {
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch").mockResolvedValue(answer(200));

        await client().send("https://example.test", {
            headers: { Accept: "text/html" },
        });

        expect(fetched.mock.calls[0][1]).toEqual({
            headers: { Accept: "text/html" },
        });
    });

    it("givenAQueuedRequestAndAFailureAheadOfIt_whenSending_thenItStillStarts", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("offline")).mockResolvedValue(answer(200));

        const underTest: HttpClient = client(1);

        await expect(
            Promise.all([underTest.send("https://example.test/one"), underTest.send("https://example.test/two")])
        ).resolves.toHaveLength(2);
    });

    it("givenTheQueueIsFull_whenARequestFinishes_thenTheNextOneStarts", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(answer(200));

        const underTest: HttpClient = client(1);

        await expect(
            Promise.all(Array.from({ length: 5 }, () => underTest.send("https://example.test")))
        ).resolves.toHaveLength(5);
    });
});
