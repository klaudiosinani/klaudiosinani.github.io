import { describe, expect, it } from "vitest";
import { EffectiveRequestHeadersFactory } from "@app/infrastructure/http/factory/EffectiveRequestHeadersFactory";
import { RequestHeadersFactory } from "@app/infrastructure/http/factory/RequestHeadersFactory";

const underTest: EffectiveRequestHeadersFactory = new EffectiveRequestHeadersFactory(
    RequestHeadersFactory.fromRecord({ Authorization: "Bearer shared" })
);

describe("EffectiveRequestHeadersFactory.create", () => {
    it("givenARequestThatAddsNothing_whenAsked_thenTheHeadersOfTheClientStand", () => {
        expect(underTest.create(RequestHeadersFactory.empty()).toRecord()).toEqual({
            Authorization: "Bearer shared",
        });
    });

    it("givenARequestWithHeadersOfItsOwn_whenAsked_thenBothAreCarried", () => {
        const headers: Record<string, string> = underTest
            .create(RequestHeadersFactory.fromRecord({ Accept: "text/html" }))
            .toRecord();

        expect(headers).toEqual({
            Authorization: "Bearer shared",
            Accept: "text/html",
        });
    });

    it("givenARequestThatNamesAHeaderOfTheClient_whenAsked_thenTheRequestWins", () => {
        const headers: Record<string, string> = underTest
            .create(RequestHeadersFactory.fromRecord({ Authorization: "Bearer own" }))
            .toRecord();

        expect(headers.Authorization).toBe("Bearer own");
    });
});

describe("EffectiveRequestHeadersFactory.createForJsonBody", () => {
    it("givenARequestThatCarriesABody_whenAsked_thenTheTypeOfTheBodyIsNamed", () => {
        const headers: Record<string, string> = underTest.createForJsonBody(RequestHeadersFactory.empty()).toRecord();

        expect(headers).toEqual({
            Authorization: "Bearer shared",
            "Content-Type": "application/json",
        });
    });

    it("givenARequestThatNamesAnotherType_whenAsked_thenTheBodyItSendsIsNamed", () => {
        const headers: Record<string, string> = underTest
            .createForJsonBody(RequestHeadersFactory.fromRecord({ "Content-Type": "text/plain" }))
            .toRecord();

        expect(headers["Content-Type"]).toBe("application/json");
    });
});
