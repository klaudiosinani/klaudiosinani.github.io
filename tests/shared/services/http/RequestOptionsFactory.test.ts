import { describe, expect, it } from "vitest";
import { RequestOptionsFactory } from "@app/infrastructure/http/factory/RequestOptionsFactory";

const underTest: typeof RequestOptionsFactory = RequestOptionsFactory;

describe("RequestOptionsFactory", () => {
    it("givenARequestThatStatesNothing_whenAsked_thenThereIsNoSignal", () => {
        expect(underTest.none().getAbortSignal()).toBeUndefined();
    });

    it("givenTwoCallers_whenAskedForNoOptions_thenTheyShareTheOneInstance", () => {
        expect(underTest.none()).toBe(underTest.none());
    });

    it("givenASignal_whenAsked_thenTheOptionsCarryIt", () => {
        const controller: AbortController = new AbortController();

        expect(underTest.withSignal(controller.signal).getAbortSignal()).toBe(controller.signal);
    });
});
