import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { ConsoleHttpRequestLog } from "@app/infrastructure/http/ConsoleHttpRequestLog";

const underTest: ConsoleHttpRequestLog = new ConsoleHttpRequestLog("Example");

afterEach(() => {
    vi.restoreAllMocks();
});

describe("ConsoleHttpRequestLog", () => {
    it("givenARequestThatSucceeded_whenStated_thenTheServiceAndTheStatusAreNamed", () => {
        const said: MockInstance<typeof console.info> = vi.spyOn(console, "info").mockImplementation(() => {});

        underTest.succeeded("things", 200);

        expect(said).toHaveBeenCalledWith("Example request succeeded: things - 200");
    });

    it("givenARequestTheServiceRefused_whenStated_thenItIsAWarning", () => {
        const warned: MockInstance<typeof console.warn> = vi.spyOn(console, "warn").mockImplementation(() => {});

        underTest.failed("things", 403);

        expect(warned).toHaveBeenCalledWith("Example request failed: things - 403");
    });

    it("givenAServiceThatWasNotReached_whenStated_thenTheRequestIsNamedAlone", () => {
        const warned: MockInstance<typeof console.warn> = vi.spyOn(console, "warn").mockImplementation(() => {});

        underTest.errored("things");

        expect(warned).toHaveBeenCalledWith("Example request errored: things");
    });

    it("givenAnAnswerThatCouldNotBeRead_whenStated_thenTheFaultIsCarriedWithIt", () => {
        const warned: MockInstance<typeof console.warn> = vi.spyOn(console, "warn").mockImplementation(() => {});
        const fault: Error = new Error("not JSON");

        underTest.errored("things", fault);

        expect(warned).toHaveBeenCalledWith("Example request errored: things", fault);
    });
});
