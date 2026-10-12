import { describe, expect, it } from "vitest";
import { HttpRequest } from "@app/infrastructure/http/HttpRequest.ts";
import { HttpRequestFactory } from "@app/infrastructure/http/HttpRequestFactory.ts";
import { HttpRequestMethod } from "@app/infrastructure/http/HttpRequestMethod.ts";
import { HttpRequestOptions } from "@app/infrastructure/http/HttpRequestOptions.ts";

const underTest: HttpRequestFactory = new HttpRequestFactory();

const options = (): HttpRequestOptions => new HttpRequestOptions(new AbortController().signal);

describe("HttpRequestFactory.create", () => {
    it("givenNoBody_whenBuilt_thenTheRequestCarriesNone", () => {
        const request: HttpRequest = underTest.create(
            HttpRequestMethod.GET,
            "https://example.test/things",
            {},
            undefined,
            options()
        );

        expect(request.getBody()).toBeUndefined();
    });

    it("givenAPayload_whenBuilt_thenItIsCarriedAsJson", () => {
        const request: HttpRequest = underTest.create(
            HttpRequestMethod.POST,
            "https://example.test/things",
            {},
            { name: "a name" },
            options()
        );

        expect(request.getBody()).toBe('{"name":"a name"}');
    });

    it("givenTheMethodAndTheEndpointAndTheHeadersAndTheOptions_whenBuilt_thenEachIsCarriedAsStated", () => {
        const signal: HttpRequestOptions = options();

        const request: HttpRequest = underTest.create(
            HttpRequestMethod.PATCH,
            "https://example.test/things/1",
            { Authorization: "******" },
            undefined,
            signal
        );

        expect(request.getMethod()).toBe(HttpRequestMethod.PATCH);
        expect(request.getEndpoint()).toBe("https://example.test/things/1");
        expect(request.getHeaders()).toEqual({ Authorization: "******" });
        expect(request.getOptions()).toBe(signal);
    });
});
