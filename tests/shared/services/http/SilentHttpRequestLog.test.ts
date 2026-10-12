import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { SilentHttpRequestLog } from "@app/infrastructure/http/SilentHttpRequestLog";

const underTest: SilentHttpRequestLog = new SilentHttpRequestLog();

afterEach(() => {
    vi.restoreAllMocks();
});

describe("SilentHttpRequestLog", () => {
    it("givenAnyOutcome_whenStated_thenNothingIsWritten", () => {
        const said: MockInstance<typeof console.info> = vi.spyOn(console, "info").mockImplementation(() => {});
        const warned: MockInstance<typeof console.warn> = vi.spyOn(console, "warn").mockImplementation(() => {});

        underTest.succeeded();
        underTest.failed();
        underTest.errored();

        expect(said).not.toHaveBeenCalled();
        expect(warned).not.toHaveBeenCalled();
    });
});
