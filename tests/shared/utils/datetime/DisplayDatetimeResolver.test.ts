import { describe, expect, it } from "vitest";
import { DisplayDatetimeResolver } from "@app/util/datetime/DisplayDatetimeResolver";
import type { DatetimeValue } from "@app/util/datetime/DatetimeValue";

const underTest: typeof DisplayDatetimeResolver = DisplayDatetimeResolver;

describe("DisplayDatetimeResolver.isUpdated", () => {
    const pub: string = "2026-01-01T00:00:00Z";

    it("givenANullModificationDate_whenCheckingIfUpdated_thenItIsFalse", () => {
        const updated: boolean = underTest.isUpdated(pub, null);

        expect(updated).toBe(false);
    });

    it("givenNoModificationDate_whenCheckingIfUpdated_thenItIsFalse", () => {
        const updated: boolean = underTest.isUpdated(pub, undefined);

        expect(updated).toBe(false);
    });

    it("givenAModificationAfterPublication_whenCheckingIfUpdated_thenItIsTrue", () => {
        const updated: boolean = underTest.isUpdated(pub, "2026-01-02T00:00:00Z");

        expect(updated).toBe(true);
    });

    it("givenAModificationBeforePublication_whenCheckingIfUpdated_thenItIsFalse", () => {
        const updated: boolean = underTest.isUpdated(pub, "2025-12-31T00:00:00Z");

        expect(updated).toBe(false);
    });

    it("givenIdenticalStamps_whenCheckingIfUpdated_thenItIsFalse", () => {
        const updated: boolean = underTest.isUpdated(pub, pub);

        expect(updated).toBe(false);
    });

    it("givenMixedStringAndDateValues_whenCheckingIfUpdated_thenTheyCompareEqually", () => {
        const updated: boolean = underTest.isUpdated(new Date(pub), "2026-01-02T00:00:00Z");

        expect(updated).toBe(true);
    });
});

describe("DisplayDatetimeResolver.resolve", () => {
    const pub: string = "2026-01-01T00:00:00Z";
    const mod: string = "2026-01-02T00:00:00Z";

    it("givenAnUpdatedEntry_whenResolvingTheDisplayStamp_thenTheModificationIsUsed", () => {
        const resolved: DatetimeValue = underTest.resolve(pub, mod);

        expect(resolved).toBe(mod);
    });

    it("givenNoModificationDate_whenResolvingTheDisplayStamp_thenPublicationIsUsed", () => {
        const resolved: DatetimeValue = underTest.resolve(pub, null);

        expect(resolved).toBe(pub);
    });

    it("givenAModificationBeforePublication_whenResolvingTheDisplayStamp_thenPublicationIsUsed", () => {
        const resolved: DatetimeValue = underTest.resolve(pub, "2025-12-31T00:00:00Z");

        expect(resolved).toBe(pub);
    });
});
