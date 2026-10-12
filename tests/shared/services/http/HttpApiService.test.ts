import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { HttpApiService } from "@app/infrastructure/http/HttpApiService.ts";
import { HttpClient } from "@app/infrastructure/http/HttpClient.ts";
import { HttpRequestAssembler } from "@app/infrastructure/http/HttpRequestAssembler.ts";
import { HttpRequestFactory } from "@app/infrastructure/http/HttpRequestFactory.ts";
import { HttpRequestOptions } from "@app/infrastructure/http/HttpRequestOptions.ts";
import { ResponseAssembler } from "@app/infrastructure/http/ResponseAssembler.ts";
import type { HttpResponse } from "@app/infrastructure/http/HttpResponse.ts";

const client = (): HttpClient => new HttpClient(new HttpRequestAssembler(), new ResponseAssembler());

const options = (): HttpRequestOptions => new HttpRequestOptions(new AbortController().signal);

const underTest: HttpApiService = new HttpApiService(client(), new HttpRequestFactory());

const answers = (response: Response): MockInstance<typeof fetch> =>
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

const sent = (fetched: MockInstance<typeof fetch>): Request => fetched.mock.calls[0][0] as Request;

afterEach(() => {
    vi.restoreAllMocks();
});

describe("HttpApiService.get", () => {
    it("givenAGetCall_whenSent_thenTheRequestCarriesTheMethodAndTheEndpoint", async () => {
        const fetched: MockInstance<typeof fetch> = answers(new Response("", { status: 200 }));

        await underTest.get("https://example.test/things", {}, options());

        expect(sent(fetched).method).toBe("GET");
        expect(sent(fetched).url).toBe("https://example.test/things");
    });

    it("givenHeaders_whenSent_thenTheyReachTheRequest", async () => {
        const fetched: MockInstance<typeof fetch> = answers(new Response("", { status: 200 }));

        await underTest.get("https://example.test/things", { Authorization: "******" }, options());

        expect(sent(fetched).headers.get("Authorization")).toBe("******");
    });

    it("givenAnAbortSignal_whenTheCallerAborts_thenTheSentRequestReflectsIt", async () => {
        const fetched: MockInstance<typeof fetch> = answers(new Response("", { status: 200 }));
        const controller: AbortController = new AbortController();

        await underTest.get("https://example.test/things", {}, new HttpRequestOptions(controller.signal));
        controller.abort();

        expect(sent(fetched).signal.aborted).toBe(true);
    });

    it("givenAServiceThatAnswers_whenSent_thenTheResponseCarriesTheStatusAndTheBody", async () => {
        answers(new Response("hello", { status: 200 }));

        const response: HttpResponse = await underTest.get("https://example.test/things", {}, options());

        expect(response.getStatus()).toBe(200);
        expect(response.getBody()).toBe("hello");
    });

    it("givenAResponseWithHeaders_whenSent_thenTheyAreCarriedAsARecord", async () => {
        answers(new Response("", { status: 200, headers: { "x-total-count": "7" } }));

        const response: HttpResponse = await underTest.get("https://example.test/things", {}, options());

        expect(response.getHeaders()["x-total-count"]).toBe("7");
    });
});

describe("HttpApiService.post", () => {
    it("givenAPayload_whenPosted_thenItIsSerialisedAsJsonOnTheRequest", async () => {
        const fetched: MockInstance<typeof fetch> = answers(new Response("", { status: 200 }));

        await underTest.post(
            "https://example.test/things",
            { "Content-Type": "application/json" },
            { name: "a name" },
            options()
        );

        const request: Request = sent(fetched);
        expect(request.method).toBe("POST");
        expect(await request.text()).toBe('{"name":"a name"}');
    });
});

describe("HttpApiService.patch", () => {
    it("givenAPayload_whenPatched_thenItIsSerialisedAsJsonOnTheRequest", async () => {
        const fetched: MockInstance<typeof fetch> = answers(new Response("", { status: 200 }));

        await underTest.patch("https://example.test/things/1", {}, { name: "a new name" }, options());

        const request: Request = sent(fetched);
        expect(request.method).toBe("PATCH");
        expect(await request.text()).toBe('{"name":"a new name"}');
    });
});

describe("HttpApiService.delete", () => {
    it("givenAPath_whenDeleted_thenTheMethodIsSentAndNoBodyWithIt", async () => {
        const fetched: MockInstance<typeof fetch> = answers(new Response("", { status: 200 }));

        await underTest.delete("https://example.test/things/1", {}, options());

        const request: Request = sent(fetched);
        expect(request.method).toBe("DELETE");
        expect(await request.text()).toBe("");
    });
});
