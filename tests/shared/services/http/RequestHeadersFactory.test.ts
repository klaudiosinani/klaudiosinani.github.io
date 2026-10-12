import { describe, expect, it } from "vitest";
import type { RequestHeaders } from "@app/infrastructure/http/domain/RequestHeaders";
import { RequestHeadersFactory } from "@app/infrastructure/http/factory/RequestHeadersFactory";

const underTest: typeof RequestHeadersFactory = RequestHeadersFactory;

describe("RequestHeadersFactory", () => {
    it("givenNoHeaders_whenAskedForAnEmptySet_thenItCarriesNothing", () => {
        expect(underTest.empty().toRecord()).toEqual({});
    });

    it("givenTwoCallers_whenAskedForAnEmptySet_thenTheyShareTheOneInstance", () => {
        expect(underTest.empty()).toBe(underTest.empty());
    });

    it("givenARecord_whenAskedForASet_thenItHoldsTheSameHeaders", () => {
        const headers: RequestHeaders = underTest.fromRecord({
            Accept: "text/html",
        });

        expect(headers.toRecord()).toEqual({ Accept: "text/html" });
    });

    it("givenARequestThatCarriesAJsonBody_whenAskedWhatToSay_thenItNamesTheType", () => {
        expect(underTest.json().toRecord()).toEqual({
            "Content-Type": "application/json",
        });
    });
});
