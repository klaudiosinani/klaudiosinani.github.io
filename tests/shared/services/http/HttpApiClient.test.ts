import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { ConsoleHttpRequestLog } from "@app/infrastructure/http/ConsoleHttpRequestLog";
import { HttpApiClient } from "@app/infrastructure/http/service/HttpApiClient";
import { RequestHeadersFactory } from "@app/infrastructure/http/factory/RequestHeadersFactory";
import { RequestOptionsFactory } from "@app/infrastructure/http/factory/RequestOptionsFactory";
import { SilentHttpRequestLog } from "@app/infrastructure/http/SilentHttpRequestLog";

const underTest: HttpApiClient = new HttpApiClient(
    "https://api.example.com",
    RequestHeadersFactory.empty(),
    new ConsoleHttpRequestLog("Example")
);

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const answers = (response: Response): MockInstance<typeof fetch> =>
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

const sentHeaders = (fetched: MockInstance<typeof fetch>): Record<string, string> =>
    fetched.mock.calls[0][1]?.headers as Record<string, string>;

const silence = (): void => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("HttpApiClient.get", () => {
    it("givenAHealthyService_whenReading_thenTheParsedBodyIsReturned", async () => {
        silence();
        answers(jsonResponse({ total: 7 }));

        const body: { total: number } | null = await underTest.get<{
            total: number;
        }>("things");

        expect(body).toEqual({ total: 7 });
    });

    it("givenABaseAndPathWithSlashes_whenReading_thenTheAddressHasExactlyOne", async () => {
        silence();
        const fetched: MockInstance<typeof fetch> = answers(jsonResponse({}));

        await new HttpApiClient(
            "https://api.example.com/",
            RequestHeadersFactory.empty(),
            new SilentHttpRequestLog()
        ).get("/things");

        expect(String(fetched.mock.calls[0][0])).toBe("https://api.example.com/things");
    });

    it("givenAWholeAddress_whenReading_thenItIsTakenAsItStands", async () => {
        silence();
        const fetched: MockInstance<typeof fetch> = answers(jsonResponse({}));

        await underTest.get("https://example.org/elsewhere.json");

        expect(String(fetched.mock.calls[0][0])).toBe("https://example.org/elsewhere.json");
    });

    it("givenAClientWithHeaders_whenReading_thenEveryRequestCarriesThem", async () => {
        silence();
        const fetched: MockInstance<typeof fetch> = answers(jsonResponse({}));

        await new HttpApiClient(
            "https://api.example.com",
            RequestHeadersFactory.fromRecord({ Authorization: "Bearer secret" }),
            new SilentHttpRequestLog()
        ).get("things");

        expect(sentHeaders(fetched).Authorization).toBe("Bearer secret");
    });

    it("givenHeadersOnOneRequest_whenReading_thenTheyAreAddedToTheOnesOfTheClient", async () => {
        silence();
        const fetched: MockInstance<typeof fetch> = answers(jsonResponse({}));

        await new HttpApiClient(
            "https://api.example.com",
            RequestHeadersFactory.fromRecord({ Authorization: "Bearer secret" }),
            new SilentHttpRequestLog()
        ).get("things", RequestHeadersFactory.fromRecord({ Accept: "text/plain" }));

        expect(sentHeaders(fetched)).toEqual({
            Authorization: "Bearer secret",
            Accept: "text/plain",
        });
    });

    it("givenOneRequestThatNamesAHeaderOfTheClient_whenReading_thenTheRequestWins", async () => {
        silence();
        const fetched: MockInstance<typeof fetch> = answers(jsonResponse({}));

        await new HttpApiClient(
            "https://api.example.com",
            RequestHeadersFactory.fromRecord({ Authorization: "Bearer shared" }),
            new SilentHttpRequestLog()
        ).get("things", RequestHeadersFactory.fromRecord({ Authorization: "Bearer own" }));

        expect(sentHeaders(fetched).Authorization).toBe("Bearer own");
    });

    it("givenARefusedRequest_whenReading_thenNothingIsReturned", async () => {
        silence();
        answers(new Response("nope", { status: 403 }));

        const body: unknown = await underTest.get("things");

        expect(body).toBeNull();
    });

    it("givenAnUnreachableHost_whenReading_thenNothingIsReturned", async () => {
        silence();
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

        const body: unknown = await underTest.get("things");

        expect(body).toBeNull();
    });

    it("givenARequestThatStatesASignal_whenReading_thenTheSignalIsSent", async () => {
        silence();
        const fetched: MockInstance<typeof fetch> = answers(jsonResponse({}));
        const controller: AbortController = new AbortController();

        await underTest.get(
            "things",
            RequestHeadersFactory.empty(),
            RequestOptionsFactory.withSignal(controller.signal)
        );

        expect(fetched.mock.calls[0][1]?.signal).toBe(controller.signal);
    });
});

describe("HttpApiClient.post", () => {
    it("givenABody_whenPosting_thenItIsSerialisedAsJson", async () => {
        silence();
        const fetched: MockInstance<typeof fetch> = answers(jsonResponse({ ok: true }));

        await underTest.post("graphql", { query: "{ viewer }" });

        const [, init] = fetched.mock.calls[0];
        expect(init?.method).toBe("POST");
        expect(init?.body).toBe('{"query":"{ viewer }"}');
        expect(sentHeaders(fetched)["Content-Type"]).toBe("application/json");
    });

    it("givenAFailedPost_whenPosting_thenNothingIsReturned", async () => {
        silence();
        answers(new Response("nope", { status: 500 }));

        const body: unknown = await underTest.post("graphql", {});

        expect(body).toBeNull();
    });
});

describe("HttpApiClient.patch", () => {
    it("givenABody_whenPatching_thenTheMethodAndTheBodyAreSent", async () => {
        silence();
        const fetched: MockInstance<typeof fetch> = answers(jsonResponse({}));

        await underTest.patch("things/1", { name: "a name" });

        const [, init] = fetched.mock.calls[0];
        expect(init?.method).toBe("PATCH");
        expect(init?.body).toBe('{"name":"a name"}');
    });
});

describe("HttpApiClient.delete", () => {
    it("givenAPath_whenDeleting_thenTheMethodIsSentAndNoBodyWithIt", async () => {
        silence();
        const fetched: MockInstance<typeof fetch> = answers(jsonResponse({}));

        await underTest.delete("things/1");

        const [, init] = fetched.mock.calls[0];
        expect(init?.method).toBe("DELETE");
        expect(init?.body).toBeUndefined();
    });
});

describe("HttpApiClient.text", () => {
    it("givenADocument_whenReadingText_thenItIsReturnedAsItStands", async () => {
        silence();
        answers(new Response("# A manual", { status: 200 }));

        const text: string | null = await underTest.text("readme");

        expect(text).toBe("# A manual");
    });

    it("givenARepositoryWithNoSuchDocument_whenReadingText_thenNothingIsReturned", async () => {
        silence();
        answers(new Response("Not Found", { status: 404 }));

        const text: string | null = await underTest.text("readme");

        expect(text).toBeNull();
    });
});

describe("HttpApiClient.response", () => {
    it("givenAnAnswer_whenTheCallerNeedsItself_thenItIsHandedOver", async () => {
        silence();
        answers(new Response("[]", { status: 200, headers: { link: 'rel="last"' } }));

        const answered: Response | null = await underTest.response("contributors");

        expect(answered?.headers.get("link")).toBe('rel="last"');
    });

    it("givenAnAnswerThatIsNotTheOneAskedFor_whenTheCallerNeedsItself_thenItIsStillHandedOver", async () => {
        silence();
        answers(new Response("nope", { status: 502, statusText: "Bad Gateway" }));

        const answered: Response | null = await underTest.response("repos");

        expect(answered?.status).toBe(502);
    });

    it("givenAnUnreachableHost_whenTheCallerNeedsTheAnswer_thenNothingIsReturned", async () => {
        silence();
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

        const answered: Response | null = await underTest.response("repos");

        expect(answered).toBeNull();
    });
});

describe("HttpApiClient when the answer is not what it claims", () => {
    it("givenABodyThatIsNotJson_whenReading_thenNothingIsReturned", async () => {
        const warned: MockInstance<(...data: unknown[]) => void> = vi
            .spyOn(console, "warn")
            .mockImplementation(() => {});
        vi.spyOn(console, "info").mockImplementation(() => {});
        answers(new Response("<html>busy</html>", { status: 200 }));

        await expect(underTest.get("anything")).resolves.toBeNull();
        expect(warned).toHaveBeenCalled();
    });
});
