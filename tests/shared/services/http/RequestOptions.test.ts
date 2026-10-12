import { describe, expect, it } from "vitest";
import { HttpRequestOptions } from "@app/infrastructure/http/HttpRequestOptions.ts";

describe("RequestOptions", () => {
    it("givenNoSignal_whenRead_thenThereIsNone", () => {
        const underTest: HttpRequestOptions = new HttpRequestOptions();

        expect(underTest.getAbortSignal()).toBeUndefined();
    });

    it("givenASignal_whenRead_thenItIsTheOneThatWasStated", () => {
        const controller: AbortController = new AbortController();
        const underTest: HttpRequestOptions = new HttpRequestOptions(controller.signal);

        expect(underTest.getAbortSignal()).toBe(controller.signal);
    });
});
