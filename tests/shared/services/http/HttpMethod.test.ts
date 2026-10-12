import { describe, expect, it } from "vitest";
import { HttpRequestMethod } from "@app/infrastructure/http/HttpRequestMethod.ts";

describe("HttpMethod", () => {
    it("givenAMethod_whenSent_thenItIsTheWordTheServiceExpects", () => {
        expect(HttpRequestMethod.GET).toBe("GET");
        expect(HttpRequestMethod.POST).toBe("POST");
        expect(HttpRequestMethod.PATCH).toBe("PATCH");
        expect(HttpRequestMethod.DELETE).toBe("DELETE");
    });
});
